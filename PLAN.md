# EXPERIENCE CLUB - Gamification Integration Plan

**Version:** 2.0.0
**Date:** January 2025
**Status:** Planning Phase

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Database Schema Extensions](#database-schema-extensions)
4. [Backend API Implementation](#backend-api-implementation)
5. [Frontend Implementation](#frontend-implementation)
6. [Admin Panel Extensions](#admin-panel-extensions)
7. [Mobile App Implementation](#mobile-app-implementation)
8. [Integration Points](#integration-points)
9. [Implementation Phases](#implementation-phases)
10. [Testing Strategy](#testing-strategy)
11. [Security Considerations](#security-considerations)
12. [Business Model](#business-model)

---

## Executive Summary

### Vision

Transform Experience Club from a pure e-commerce platform into a **Gamified Loyalty & Rewards Ecosystem** where users earn "Coins" (Moedas) by completing daily tasks and can redeem them for products in the existing shopping platform.

### Core Principle

**⚠️ CRITICAL: NO DELETION OR MODIFICATION OF EXISTING E-COMMERCE FUNCTIONALITY**

- All existing e-commerce features remain 100% functional
- New gamification system is **additive only**
- Users can access both gaming and shopping experiences
- Seamless transition between game and shop

### Key Features

✅ **Gamification App** - Daily tasks, coin rewards, progress tracking
✅ **Existing E-Commerce** - Full shopping experience (unchanged)
✅ **Unified User System** - Single authentication across both apps
✅ **Coin-Based Rewards** - Earn coins through tasks, spend in shop
✅ **Admin Management** - Control tasks, verify actions, manage rewards

---

## Architecture Overview

### System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Experience Club Platform                      │
└─────────────────────────────────────────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
   ┌────▼─────┐         ┌──────▼──────┐       ┌──────▼──────┐
   │  GAME    │         │    SHOP     │       │   MOBILE    │
   │ (New)    │◄───────►│ (Existing)  │       │ (Hybrid)    │
   │ :3060/   │         │ :3060/shop  │       │ Game + Shop │
   │  game    │         │             │       │             │
   └────┬─────┘         └──────┬──────┘       └──────┬──────┘
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
                        ┌──────▼──────┐
                        │   Backend   │
                        │   NestJS    │
                        │   :3062     │
                        │             │
                        │ /api/game   │ ← New Game APIs
                        │ /api/*      │ ← Existing APIs
                        └──────┬──────┘
                               │
                        ┌──────▼──────┐
                        │ PostgreSQL  │
                        │  Database   │
                        │             │
                        │ Game Tables │ ← New Tables
                        │ E-comm Tables│ ← Existing
                        └─────────────┘
```

### Route Structure

**Frontend (Next.js):**
```
/                       → Game Landing Page (NEW)
/game                   → Game Dashboard (NEW)
/game/tasks             → Task List (NEW)
/game/leaderboard       → Rankings (NEW)
/game/profile           → User Profile (NEW)

/shop                   → E-Commerce Home (EXISTING, RENAMED)
/shop/product/[id]      → Product Details (EXISTING)
/shop/cart              → Shopping Cart (EXISTING)
/shop/checkout          → Checkout (EXISTING)
/shop/dashboard         → User Dashboard (EXISTING)
```

**Mobile (React Native):**
```
/game                   → Game Tab (NEW)
/shop                   → Shop Tab (EXISTING)
/cart                   → Cart Tab (EXISTING)
/profile                → Profile Tab (EXISTING)
```

**Backend API:**
```
/api/game/tasks         → Task management (NEW)
/api/game/progress      → User progress (NEW)
/api/game/coins         → Coin transactions (NEW)
/api/game/rewards       → Reward redemption (NEW)

/api/products           → Products (EXISTING)
/api/cart               → Cart (EXISTING)
/api/orders             → Orders (EXISTING - EXTENDED for coin payment)
```

---

## Database Schema Extensions

### New Tables (Additive Only)

#### 1. GameTask

```prisma
model GameTask {
  id              String        @id @default(cuid())
  name            String
  description     String
  coinReward      Int           // Coins earned
  taskType        TaskType      // REGISTRATION, APP_INSTALL, SOCIAL_POST, etc.
  delayHours      Int           // Cooldown period (24, 48, etc.)
  orderIndex      Int           // Task sequence
  isActive        Boolean       @default(true)
  verificationRequired Boolean  @default(false)
  externalUrl     String?       // For affiliate links
  instructions    String?       // Detailed instructions
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  userTasks       UserTask[]

  @@index([orderIndex])
  @@index([isActive])
}

enum TaskType {
  REGISTRATION
  APP_INSTALL
  SOCIAL_POST
  REFERRAL
  SELFIE
  SURVEY
  AFFILIATE_ACTION
  DAILY_LOGIN
  WATCH_VIDEO
  SHARE_LINK
}
```

#### 2. UserTask

```prisma
model UserTask {
  id              String        @id @default(cuid())
  userId          String
  taskId          String
  status          TaskStatus    @default(LOCKED)
  startedAt       DateTime?
  completedAt     DateTime?
  verifiedAt      DateTime?
  nextAvailableAt DateTime?     // When next task unlocks
  proofUrl        String?       // Screenshot/selfie URL
  verificationNotes String?     // Admin notes
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  task            GameTask      @relation(fields: [taskId], references: [id])

  @@unique([userId, taskId])
  @@index([userId, status])
  @@index([status, nextAvailableAt])
}

enum TaskStatus {
  LOCKED          // Not yet available
  AVAILABLE       // Can be started
  IN_PROGRESS     // Started, waiting for action
  PENDING_VERIFY  // Waiting admin verification
  COMPLETED       // Done and verified
  EXPIRED         // Missed window
}
```

#### 3. CoinTransaction

```prisma
model CoinTransaction {
  id              String        @id @default(cuid())
  userId          String
  amount          Int           // Positive = earned, Negative = spent
  type            TransactionType
  description     String
  referenceId     String?       // TaskId, OrderId, etc.
  referenceType   String?       // "task", "order", "bonus", "penalty"
  balanceBefore   Int
  balanceAfter    Int
  createdAt       DateTime      @default(now())

  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, createdAt])
  @@index([type, createdAt])
}

enum TransactionType {
  TASK_REWARD
  REFERRAL_BONUS
  ADMIN_BONUS
  ORDER_REDEMPTION
  REFUND
  PENALTY
  PROMOTION
}
```

#### 4. Referral

```prisma
model Referral {
  id              String        @id @default(cuid())
  referrerId      String        // User who referred
  referredId      String        // New user
  referralCode    String        @unique
  status          ReferralStatus @default(PENDING)
  rewardClaimed   Boolean       @default(false)
  coinReward      Int           @default(0)
  createdAt       DateTime      @default(now())
  claimedAt       DateTime?

  referrer        User          @relation("ReferralsMade", fields: [referrerId], references: [id])
  referred        User          @relation("ReferralsReceived", fields: [referredId], references: [id])

  @@unique([referrerId, referredId])
  @@index([referralCode])
  @@index([referrerId, status])
}

enum ReferralStatus {
  PENDING
  REGISTERED
  COMPLETED_FIRST_TASK
  REWARD_GIVEN
}
```

#### 5. DailyStreak

```prisma
model DailyStreak {
  id              String        @id @default(cuid())
  userId          String        @unique
  currentStreak   Int           @default(0)
  longestStreak   Int           @default(0)
  lastCheckIn     DateTime?
  totalCheckIns   Int           @default(0)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([currentStreak])
}
```

### Extended Existing Models

#### User (EXTENDED)

```prisma
model User {
  // ... EXISTING FIELDS (DO NOT CHANGE) ...
  id              String
  email           String
  name            String?
  password        String
  role            Role
  // ... etc ...

  // NEW GAME FIELDS (ADDITIVE)
  coinBalance     Int           @default(50)  // Starting coins
  totalCoinsEarned Int          @default(50)
  referralCode    String?       @unique
  onboardingComplete Boolean    @default(false)
  gameProfilePic  String?       // Selfie URL
  lastGameAccess  DateTime?

  // NEW RELATIONS
  userTasks       UserTask[]
  coinTransactions CoinTransaction[]
  referralsMade   Referral[]    @relation("ReferralsMade")
  referralsReceived Referral[]  @relation("ReferralsReceived")
  dailyStreak     DailyStreak?

  // ... EXISTING RELATIONS (DO NOT CHANGE) ...
  orders          Order[]
  cart            Cart?
  wishlist        Wishlist[]
}
```

#### Order (EXTENDED)

```prisma
model Order {
  // ... EXISTING FIELDS (DO NOT CHANGE) ...

  // NEW PAYMENT FIELDS (ADDITIVE)
  coinsUsed       Int?          @default(0)
  coinDiscount    Float?        @default(0)
  paymentSplit    Json?         // { cash: 100, coins: 50 }

  // ... EXISTING RELATIONS (DO NOT CHANGE) ...
}
```

---

## Backend API Implementation

### New Module: Game Module

#### File Structure

```
backend/src/
├── game/
│   ├── game.module.ts
│   ├── tasks/
│   │   ├── tasks.controller.ts
│   │   ├── tasks.service.ts
│   │   └── dto/
│   │       ├── create-task.dto.ts
│   │       ├── update-task.dto.ts
│   │       └── complete-task.dto.ts
│   ├── progress/
│   │   ├── progress.controller.ts
│   │   ├── progress.service.ts
│   │   └── dto/
│   ├── coins/
│   │   ├── coins.controller.ts
│   │   ├── coins.service.ts
│   │   └── dto/
│   ├── referrals/
│   │   ├── referrals.controller.ts
│   │   ├── referrals.service.ts
│   │   └── dto/
│   └── rewards/
│       ├── rewards.controller.ts
│       ├── rewards.service.ts
│       └── dto/
```

#### API Endpoints (NEW)

**Tasks API** (`/api/game/tasks`)

```typescript
GET    /api/game/tasks              // List all tasks (admin/user)
GET    /api/game/tasks/:id          // Get task details
POST   /api/game/tasks              // Create task (admin only)
PATCH  /api/game/tasks/:id          // Update task (admin only)
DELETE /api/game/tasks/:id          // Delete task (admin only)
```

**Progress API** (`/api/game/progress`)

```typescript
GET    /api/game/progress           // Get user's progress (JWT required)
GET    /api/game/progress/dashboard // Dashboard stats (JWT required)
GET    /api/game/progress/next-task // Get next available task (JWT required)
POST   /api/game/progress/start/:taskId     // Start a task (JWT required)
POST   /api/game/progress/complete/:taskId  // Submit task completion (JWT required)
POST   /api/game/progress/verify/:userTaskId // Verify task (admin only)
```

**Coins API** (`/api/game/coins`)

```typescript
GET    /api/game/coins/balance      // Get coin balance (JWT required)
GET    /api/game/coins/transactions // Get transaction history (JWT required)
POST   /api/game/coins/transfer     // Admin: Give/take coins (admin only)
GET    /api/game/coins/stats        // Coin statistics (admin only)
```

**Referrals API** (`/api/game/referrals`)

```typescript
GET    /api/game/referrals          // Get user's referrals (JWT required)
POST   /api/game/referrals/generate // Generate referral code (JWT required)
GET    /api/game/referrals/:code    // Get referral by code (public)
POST   /api/game/referrals/claim    // Claim referral bonus (JWT required)
```

**Rewards API** (`/api/game/rewards`)

```typescript
GET    /api/game/rewards            // Get available rewards (JWT required)
POST   /api/game/rewards/redeem     // Redeem coins for products (JWT required)
```

**Leaderboard API** (`/api/game/leaderboard`)

```typescript
GET    /api/game/leaderboard        // Top users by coins (public)
GET    /api/game/leaderboard/me     // User's rank (JWT required)
```

#### Key Services

**TasksService**

```typescript
class TasksService {
  // Get all active tasks in order
  async getActiveTasks(): Promise<GameTask[]>

  // Get user's task progress
  async getUserTaskProgress(userId: string): Promise<UserTaskWithDetails[]>

  // Start a task (if available)
  async startTask(userId: string, taskId: string): Promise<UserTask>

  // Complete a task
  async completeTask(userId: string, taskId: string, proof?: File): Promise<UserTask>

  // Verify task (admin)
  async verifyTask(userTaskId: string, approved: boolean, notes?: string): Promise<UserTask>

  // Check and unlock next task
  async checkAndUnlockNext(userId: string): Promise<void>
}
```

**CoinsService**

```typescript
class CoinsService {
  // Get user balance
  async getBalance(userId: string): Promise<number>

  // Award coins (task completion, referral, bonus)
  async awardCoins(userId: string, amount: number, type: TransactionType, description: string, referenceId?: string): Promise<CoinTransaction>

  // Deduct coins (order payment, penalty)
  async deductCoins(userId: string, amount: number, type: TransactionType, description: string, referenceId?: string): Promise<CoinTransaction>

  // Get transaction history
  async getTransactions(userId: string, limit?: number): Promise<CoinTransaction[]>

  // Calculate USD value (1 coin = 1 USD)
  calculateUsdValue(coins: number): number
}
```

**ReferralsService**

```typescript
class ReferralsService {
  // Generate unique referral code
  async generateCode(userId: string): Promise<string>

  // Register referral (on new user signup)
  async registerReferral(referralCode: string, newUserId: string): Promise<Referral>

  // Update referral status
  async updateStatus(referralId: string, status: ReferralStatus): Promise<Referral>

  // Claim referral bonus
  async claimBonus(referrerId: string, referralId: string): Promise<CoinTransaction>

  // Get user's referrals
  async getUserReferrals(userId: string): Promise<Referral[]>
}
```

#### Extended Services

**OrdersService (EXTENDED)**

```typescript
class OrdersService {
  // ... EXISTING METHODS (DO NOT CHANGE) ...

  // NEW METHOD: Create order with coin payment
  async createOrderWithCoins(
    userId: string,
    coinsToUse: number,
    orderData: CreateOrderDto
  ): Promise<Order> {
    // 1. Validate coin balance
    const balance = await this.coinsService.getBalance(userId);
    if (balance < coinsToUse) throw new BadRequestException('Insufficient coins');

    // 2. Calculate discount (1 coin = 1 USD)
    const coinDiscount = this.coinsService.calculateUsdValue(coinsToUse);

    // 3. Create order with discount
    const order = await this.createOrder(userId, {
      ...orderData,
      coinDiscount,
      coinsUsed: coinsToUse,
    });

    // 4. Deduct coins
    await this.coinsService.deductCoins(
      userId,
      coinsToUse,
      TransactionType.ORDER_REDEMPTION,
      `Order #${order.id}`,
      order.id
    );

    return order;
  }
}
```

**AuthService (EXTENDED)**

```typescript
class AuthService {
  // ... EXISTING METHODS (DO NOT CHANGE) ...

  // NEW METHOD: Register with referral code
  async registerWithReferral(
    registerDto: RegisterDto,
    referralCode?: string
  ): Promise<{ user: User; token: string }> {
    // 1. Create user (existing logic)
    const user = await this.register(registerDto);

    // 2. Award initial coins (50 for registration)
    await this.coinsService.awardCoins(
      user.id,
      50,
      TransactionType.TASK_REWARD,
      'Registration bonus',
      'registration'
    );

    // 3. Process referral if provided
    if (referralCode) {
      await this.referralsService.registerReferral(referralCode, user.id);
    }

    // 4. Generate user's referral code
    await this.referralsService.generateCode(user.id);

    // 5. Create first task (install app)
    await this.tasksService.initializeUserTasks(user.id);

    return { user, token: this.generateToken(user) };
  }
}
```

---

## Frontend Implementation

### New Pages & Components

#### Route Structure (MODIFIED)

**Current:**
```
/                 → Home (Product Grid)
```

**New:**
```
/                 → Game Landing Page (NEW)
/game             → Game Dashboard (NEW)
/shop             → E-commerce Home (EXISTING, MOVED)
```

#### File Structure

```
frontend/
├── app/
│   ├── page.tsx                  → MODIFIED: Game Landing
│   ├── game/
│   │   ├── layout.tsx            → NEW: Game layout
│   │   ├── page.tsx              → NEW: Dashboard
│   │   ├── tasks/page.tsx        → NEW: Task list
│   │   ├── leaderboard/page.tsx  → NEW: Rankings
│   │   ├── profile/page.tsx      → NEW: User profile
│   │   └── rewards/page.tsx      → NEW: Reward shop
│   ├── shop/                     → EXISTING (MOVED from root)
│   │   ├── page.tsx              → EXISTING: Product home
│   │   ├── product/[id]/page.tsx → EXISTING
│   │   ├── cart/page.tsx         → EXISTING
│   │   ├── checkout/page.tsx     → EXTENDED: Coin payment
│   │   └── ...                   → ALL EXISTING PAGES
│   └── ...
├── components/
│   ├── game/                     → NEW
│   │   ├── CoinBalance.tsx
│   │   ├── TaskCard.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── CountdownTimer.tsx
│   │   ├── ReferralWidget.tsx
│   │   └── SwitchToShopButton.tsx
│   ├── shop/                     → NEW FOLDER (existing components moved here)
│   │   ├── ProductCard.tsx       → EXISTING (MOVED)
│   │   ├── Navigation.tsx        → EXISTING (MOVED)
│   │   └── ...
│   └── shared/                   → NEW
│       ├── UnifiedNavigation.tsx → NEW: Nav with Game/Shop toggle
│       └── ...
├── lib/
│   ├── game-api.ts               → NEW: Game API calls
│   ├── products-api.ts           → EXISTING (unchanged)
│   └── ...
```

#### 1. Game Landing Page (`/page.tsx`)

**Purpose:** Landing page with game intro and CTA to start

```tsx
// app/page.tsx
import { Suspense } from 'react';
import { HeroSection } from '@/components/game/HeroSection';
import { HowItWorks } from '@/components/game/HowItWorks';
import { FirstTasks } from '@/components/game/FirstTasks';
import { SwitchToShopButton } from '@/components/game/SwitchToShopButton';

export default function GameLandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Sua Rotina Online Vale $1.000 USD"
        subtitle="Complete tarefas diárias, acumule Moedas (1 Moeda = 1 USD) e troque por produtos reais"
        ctaText="Começar a Jornada Grátis!"
      />

      {/* How It Works */}
      <HowItWorks />

      {/* First Tasks Preview */}
      <FirstTasks />

      {/* Switch to Shop */}
      <SwitchToShopButton
        text="Já tenho moedas! Ver Produtos"
        href="/shop"
      />
    </div>
  );
}
```

#### 2. Game Dashboard (`/game/page.tsx`)

**Purpose:** User's main game interface

```tsx
// app/game/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { gameApi } from '@/lib/game-api';
import { CoinBalance } from '@/components/game/CoinBalance';
import { ProgressBar } from '@/components/game/ProgressBar';
import { NextTaskCard } from '@/components/game/NextTaskCard';
import { ReferralWidget } from '@/components/game/ReferralWidget';
import { SwitchToShopButton } from '@/components/game/SwitchToShopButton';

export default function GameDashboard() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const data = await gameApi.getProgress();
      setProgress(data);
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Coin Balance */}
      <CoinBalance
        balance={progress.coinBalance}
        totalEarned={progress.totalCoinsEarned}
      />

      {/* Progress to Goal */}
      <ProgressBar
        current={progress.coinBalance}
        goal={1000}
        label="Meta de Resgate"
      />

      {/* Next Available Task */}
      <NextTaskCard
        task={progress.nextTask}
        onStart={handleStartTask}
      />

      {/* Referral Widget */}
      <ReferralWidget
        referralCode={progress.referralCode}
        referralCount={progress.referralCount}
      />

      {/* Switch to Shop */}
      <SwitchToShopButton
        text="Resgatar Moedas na Loja"
        href="/shop"
        variant="primary"
      />
    </div>
  );
}
```

#### 3. Task List Page (`/game/tasks/page.tsx`)

```tsx
// app/game/tasks/page.tsx
'use client';
import { TaskJourney } from '@/components/game/TaskJourney';
import { TaskCard } from '@/components/game/TaskCard';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const data = await gameApi.getUserTasks();
    setTasks(data);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sua Jornada</h1>

      <TaskJourney tasks={tasks} onTaskClick={handleTaskClick} />
    </div>
  );
}
```

#### Key Components

**CoinBalance.tsx**

```tsx
// components/game/CoinBalance.tsx
export function CoinBalance({ balance, totalEarned }) {
  const usdValue = balance * 1; // 1 coin = 1 USD

  return (
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 text-white">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm opacity-90">Saldo Atual</p>
          <h2 className="text-4xl font-bold">{balance.toLocaleString()} Moedas</h2>
          <p className="text-lg mt-1">≈ ${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</p>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-90">Total Ganho</p>
          <p className="text-2xl font-semibold">{totalEarned.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
```

**NextTaskCard.tsx**

```tsx
// components/game/NextTaskCard.tsx
export function NextTaskCard({ task, onStart }) {
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    if (task?.nextAvailableAt) {
      const interval = setInterval(() => {
        const remaining = calculateTimeRemaining(task.nextAvailableAt);
        setTimeRemaining(remaining);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [task]);

  if (!task) {
    return (
      <div className="text-center py-12">
        <p className="text-xl">🎉 Todas as tarefas completadas!</p>
        <p className="text-gray-600 mt-2">Visite a loja para resgatar suas moedas</p>
      </div>
    );
  }

  if (task.status === 'LOCKED' && timeRemaining) {
    return (
      <div className="border border-gray-300 rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div className="text-6xl">🔒</div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-700">Próxima Tarefa Bloqueada</h3>
            <p className="text-gray-600 mt-2">Desbloqueia em:</p>
            <CountdownTimer timeRemaining={timeRemaining} />
          </div>
        </div>
      </div>
    );
  }

  if (task.status === 'AVAILABLE') {
    return (
      <div className="border-2 border-green-500 rounded-lg p-6 bg-green-50">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-green-800">{task.name}</h3>
            <p className="text-gray-700 mt-2">{task.description}</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-3xl font-bold text-green-600">+{task.coinReward}</span>
              <span className="text-lg text-gray-600">Moedas</span>
            </div>
          </div>
          <button
            onClick={() => onStart(task.id)}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg"
          >
            Começar Agora!
          </button>
        </div>
      </div>
    );
  }

  return null;
}
```

**SwitchToShopButton.tsx**

```tsx
// components/game/SwitchToShopButton.tsx
import Link from 'next/link';

export function SwitchToShopButton({ text, href, variant = 'secondary' }) {
  const baseClass = "block w-full text-center py-4 px-6 rounded-lg font-semibold text-lg transition-colors";
  const variantClass = variant === 'primary'
    ? "bg-blue-600 hover:bg-blue-700 text-white"
    : "bg-gray-200 hover:bg-gray-300 text-gray-800";

  return (
    <Link href={href} className={`${baseClass} ${variantClass}`}>
      🛍️ {text}
    </Link>
  );
}
```

#### Modified Components

**Checkout Page (EXTENDED)**

```tsx
// app/shop/checkout/page.tsx
'use client';
export default function CheckoutPage() {
  const [useCoins, setUseCoins] = useState(0);
  const [coinBalance, setCoinBalance] = useState(0);

  useEffect(() => {
    loadCoinBalance();
  }, []);

  const loadCoinBalance = async () => {
    const balance = await gameApi.getCoinBalance();
    setCoinBalance(balance);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // EXISTING checkout logic
    const orderData = {
      // ... existing order fields
    };

    // NEW: Create order with coin payment
    if (useCoins > 0) {
      await ordersApi.createOrderWithCoins(useCoins, orderData);
    } else {
      await ordersApi.createOrder(orderData);
    }
  };

  return (
    <div>
      {/* EXISTING checkout form */}

      {/* NEW: Coin Payment Section */}
      {coinBalance > 0 && (
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Usar Moedas do Experience Club</h3>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">Saldo disponível: <strong>{coinBalance} Moedas</strong> (${coinBalance} USD)</p>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Moedas a usar:</label>
              <input
                type="number"
                min="0"
                max={Math.min(coinBalance, total)}
                value={useCoins}
                onChange={(e) => setUseCoins(parseInt(e.target.value) || 0)}
                className="w-full border rounded px-3 py-2"
              />
              <p className="text-xs text-gray-600 mt-1">
                Desconto: ${useCoins} USD
              </p>
            </div>
          </div>
        </div>
      )}

      {/* EXISTING: Submit button, etc. */}
    </div>
  );
}
```

### Game API Library

```typescript
// lib/game-api.ts
import { api } from './axios';

export const gameApi = {
  // Progress
  getProgress: async () => {
    const { data } = await api.get('/game/progress');
    return data;
  },

  getDashboard: async () => {
    const { data } = await api.get('/game/progress/dashboard');
    return data;
  },

  // Tasks
  getTasks: async () => {
    const { data } = await api.get('/game/tasks');
    return data;
  },

  getUserTasks: async () => {
    const { data } = await api.get('/game/progress');
    return data.tasks;
  },

  startTask: async (taskId: string) => {
    const { data } = await api.post(`/game/progress/start/${taskId}`);
    return data;
  },

  completeTask: async (taskId: string, proof?: File) => {
    const formData = new FormData();
    if (proof) formData.append('proof', proof);

    const { data } = await api.post(`/game/progress/complete/${taskId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  // Coins
  getCoinBalance: async () => {
    const { data } = await api.get('/game/coins/balance');
    return data.balance;
  },

  getTransactions: async (limit = 50) => {
    const { data } = await api.get(`/game/coins/transactions?limit=${limit}`);
    return data;
  },

  // Referrals
  getReferrals: async () => {
    const { data } = await api.get('/game/referrals');
    return data;
  },

  generateReferralCode: async () => {
    const { data } = await api.post('/game/referrals/generate');
    return data;
  },

  claimReferralBonus: async (referralId: string) => {
    const { data } = await api.post('/game/referrals/claim', { referralId });
    return data;
  },

  // Leaderboard
  getLeaderboard: async (limit = 100) => {
    const { data } = await api.get(`/game/leaderboard?limit=${limit}`);
    return data;
  },

  getMyRank: async () => {
    const { data } = await api.get('/game/leaderboard/me');
    return data;
  },
};
```

---

## Admin Panel Extensions

### New Admin Routes

```
/admin/game                  → Game Overview (NEW)
/admin/game/tasks            → Task Management (NEW)
/admin/game/verifications    → Verify User Tasks (NEW)
/admin/game/users            → User Progress (NEW)
/admin/game/coins            → Coin Management (NEW)
/admin/game/leaderboard      → Leaderboard (NEW)

/admin/products              → EXISTING (unchanged)
/admin/orders                → EXISTING (unchanged)
/admin/brands                → EXISTING (unchanged)
/admin/categories            → EXISTING (unchanged)
```

### File Structure

```
admin/
├── app/
│   ├── admin/
│   │   ├── game/                  → NEW
│   │   │   ├── page.tsx           → Game overview
│   │   │   ├── tasks/
│   │   │   │   ├── page.tsx       → Task list
│   │   │   │   ├── add/page.tsx   → Create task
│   │   │   │   └── [id]/page.tsx  → Edit task
│   │   │   ├── verifications/
│   │   │   │   └── page.tsx       → Verify user tasks
│   │   │   ├── users/
│   │   │   │   └── page.tsx       → User progress
│   │   │   └── coins/
│   │   │       └── page.tsx       → Coin management
│   │   ├── products/              → EXISTING
│   │   ├── orders/                → EXISTING
│   │   └── ...
```

### New Admin Pages

#### 1. Game Overview (`/admin/game/page.tsx`)

```tsx
// admin/app/admin/game/page.tsx
'use client';
export default function GameOverviewPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await gameApi.getAdminStats();
    setStats(data);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Game Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value={stats?.totalUsers} />
        <StatCard title="Active Users (7d)" value={stats?.activeUsers} />
        <StatCard title="Total Coins Earned" value={stats?.totalCoinsEarned} />
        <StatCard title="Pending Verifications" value={stats?.pendingVerifications} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentVerifications />
        <TopUsers />
      </div>
    </div>
  );
}
```

#### 2. Task Management (`/admin/game/tasks/page.tsx`)

```tsx
// admin/app/admin/game/tasks/page.tsx
'use client';
export default function TaskManagementPage() {
  const [tasks, setTasks] = useState([]);

  const handleCreateTask = async (taskData) => {
    await gameApi.createTask(taskData);
    loadTasks();
  };

  const handleToggleActive = async (taskId, isActive) => {
    await gameApi.updateTask(taskId, { isActive });
    loadTasks();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Task Management</h1>
        <Link href="/admin/game/tasks/add">
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg">
            + New Task
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Order</th>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Coins</th>
              <th className="text-left p-4">Delay (hrs)</th>
              <th className="text-left p-4">Active</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{task.orderIndex}</td>
                <td className="p-4 font-semibold">{task.name}</td>
                <td className="p-4">{task.taskType}</td>
                <td className="p-4 text-green-600 font-bold">+{task.coinReward}</td>
                <td className="p-4">{task.delayHours}h</td>
                <td className="p-4">
                  <Toggle
                    checked={task.isActive}
                    onChange={(val) => handleToggleActive(task.id, val)}
                  />
                </td>
                <td className="p-4">
                  <Link href={`/admin/game/tasks/${task.id}`}>
                    <button className="text-blue-600 hover:underline">Edit</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

#### 3. Task Verification (`/admin/game/verifications/page.tsx`)

```tsx
// admin/app/admin/game/verifications/page.tsx
'use client';
export default function TaskVerificationsPage() {
  const [pending, setPending] = useState([]);

  const handleVerify = async (userTaskId, approved, notes) => {
    await gameApi.verifyTask(userTaskId, approved, notes);
    loadPending();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Pending Verifications ({pending.length})</h1>

      <div className="space-y-4">
        {pending.map(userTask => (
          <div key={userTask.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{userTask.task.name}</h3>
                <p className="text-gray-600 mt-1">User: {userTask.user.email}</p>
                <p className="text-sm text-gray-500">Completed: {formatDate(userTask.completedAt)}</p>

                {userTask.proofUrl && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Proof:</p>
                    <img src={userTask.proofUrl} alt="Proof" className="max-w-md rounded" />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleVerify(userTask.id, true, '')}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  ✓ Approve (+{userTask.task.coinReward} coins)
                </button>
                <button
                  onClick={() => {
                    const notes = prompt('Rejection reason:');
                    if (notes) handleVerify(userTask.id, false, notes);
                  }}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                >
                  ✗ Reject
                </button>
              </div>
            </div>
          </div>
        ))}

        {pending.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No pending verifications
          </div>
        )}
      </div>
    </div>
  );
}
```

### Modified Admin Navigation

```tsx
// admin/components/AdminSidebar.tsx
export function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen">
      <nav className="p-4">
        {/* EXISTING E-COMMERCE SECTION */}
        <div className="mb-6">
          <h3 className="text-xs uppercase text-gray-400 mb-2">E-Commerce</h3>
          <NavLink href="/admin/products" icon="📦">Products</NavLink>
          <NavLink href="/admin/orders" icon="🛒">Orders</NavLink>
          <NavLink href="/admin/brands" icon="🏷️">Brands</NavLink>
          <NavLink href="/admin/categories" icon="📂">Categories</NavLink>
        </div>

        {/* NEW: GAME SECTION */}
        <div className="mb-6">
          <h3 className="text-xs uppercase text-gray-400 mb-2">Game System</h3>
          <NavLink href="/admin/game" icon="🎮">Overview</NavLink>
          <NavLink href="/admin/game/tasks" icon="✅">Tasks</NavLink>
          <NavLink href="/admin/game/verifications" icon="🔍">Verifications</NavLink>
          <NavLink href="/admin/game/users" icon="👥">User Progress</NavLink>
          <NavLink href="/admin/game/coins" icon="💰">Coin Management</NavLink>
        </div>

        {/* EXISTING: SETTINGS, ETC. */}
      </nav>
    </aside>
  );
}
```

---

## Mobile App Implementation

### Navigation Structure (MODIFIED)

**Current:**
```
Tab 1: Shop
Tab 2: Wishlist
Tab 3: Cart
Tab 4: Profile
```

**New:**
```
Tab 1: Game (NEW)
Tab 2: Shop (EXISTING)
Tab 3: Cart (EXISTING)
Tab 4: Profile (EXISTING - EXTENDED)
```

### File Structure

```
mobile/src/
├── app/
│   ├── (app)/
│   │   ├── index.tsx              → MODIFIED: Game Dashboard (was Shop)
│   │   ├── shop.tsx               → NEW: Shop tab (existing shop moved here)
│   │   ├── cart.tsx               → EXISTING
│   │   ├── profile.tsx            → EXISTING (extended)
│   │   └── _layout.tsx            → MODIFIED: New tab structure
│   ├── game/
│   │   ├── tasks.tsx              → NEW: Task list
│   │   ├── task-detail/[id].tsx   → NEW: Task details
│   │   ├── leaderboard.tsx        → NEW: Rankings
│   │   └── referrals.tsx          → NEW: Referral management
│   ├── product/[id].tsx           → EXISTING (unchanged)
│   └── checkout.tsx               → EXTENDED: Coin payment
├── components/
│   ├── game/                      → NEW
│   │   ├── CoinBalance.tsx
│   │   ├── TaskCard.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── CountdownTimer.tsx
│   │   └── ReferralCard.tsx
│   └── ui/                        → EXISTING
```

### Modified Tab Layout

```tsx
// mobile/src/app/(app)/_layout.tsx
export default function AppLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Game',
          tabBarIcon: ({ color }) => <IconGame color={color} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color }) => <IconShoppingBag color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => <IconShoppingCart color={color} />,
          tabBarBadge: cartItemsCount,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconUser color={color} />,
        }}
      />
    </Tabs>
  );
}
```

### Game Dashboard (Mobile)

```tsx
// mobile/src/app/(app)/index.tsx
import { View, ScrollView, RefreshControl } from 'react-native';
import { CoinBalance } from '@/components/game/CoinBalance';
import { NextTaskCard } from '@/components/game/NextTaskCard';
import { QuickStats } from '@/components/game/QuickStats';

export default function GameDashboard() {
  const { data: progress, isLoading, refetch } = useProgress();
  const router = useRouter();

  const handleStartTask = (taskId: string) => {
    router.push(`/game/task-detail/${taskId}`);
  };

  const handleGoToShop = () => {
    router.push('/shop');
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      <View className="p-4 space-y-4">
        {/* Coin Balance */}
        <CoinBalance
          balance={progress?.coinBalance || 0}
          totalEarned={progress?.totalCoinsEarned || 0}
        />

        {/* Progress Bar */}
        <ProgressBar
          current={progress?.coinBalance || 0}
          goal={1000}
          label="Meta de Resgate"
        />

        {/* Next Task */}
        <NextTaskCard
          task={progress?.nextTask}
          onStart={handleStartTask}
        />

        {/* Quick Stats */}
        <QuickStats
          tasksCompleted={progress?.completedTasks || 0}
          daysActive={progress?.daysActive || 0}
          referrals={progress?.referralCount || 0}
        />

        {/* Switch to Shop */}
        <Button
          onPress={handleGoToShop}
          title="🛍️ Ver Produtos na Loja"
          variant="outline"
        />
      </View>
    </ScrollView>
  );
}
```

### Shop Tab (Mobile)

```tsx
// mobile/src/app/(app)/shop.tsx
// THIS IS THE EXISTING SHOP LOGIC (MOVED FROM index.tsx)
import { View } from 'react-native';
import { ProductList } from '@/components/ui/product-list';

export default function ShopTab() {
  // EXISTING SHOP CODE (unchanged)
  const { data: products } = useProducts();

  return (
    <View className="flex-1">
      <ProductList products={products} />
    </View>
  );
}
```

### Mobile Game API

```typescript
// mobile/src/api/game/use-progress.ts
import { createQuery } from 'react-query-kit';
import { client } from '../common/client';

export const useProgress = createQuery({
  queryKey: ['game-progress'],
  fetcher: async () => {
    const { data } = await client.get('/game/progress/dashboard');
    return data;
  },
});

// mobile/src/api/game/use-start-task.ts
import { createMutation } from 'react-query-kit';

export const useStartTask = createMutation({
  mutationFn: async (taskId: string) => {
    const { data } = await client.post(`/game/progress/start/${taskId}`);
    return data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries(['game-progress']);
  },
});
```

---

## Integration Points

### 1. Unified Authentication

**Single Sign-On:**
- User logs in once
- JWT token valid for both Game and Shop
- User object contains both e-commerce and game data

**Registration Flow:**
```
1. User registers (optionally with referral code)
2. User receives 50 coins (registration reward)
3. User's first task is initialized
4. User can immediately access both Game and Shop
```

### 2. Navigation Between Game and Shop

**Frontend:**
```tsx
// From Game → Shop
<Link href="/shop">Ver Produtos na Loja</Link>

// From Shop → Game
<Link href="/game">Ganhar Mais Moedas</Link>
```

**Mobile:**
```tsx
// From Game Tab → Shop Tab
router.push('/shop');

// From Shop Tab → Game Tab
router.push('/');
```

### 3. Coin Integration in Checkout

**Flow:**
1. User adds products to cart (existing flow)
2. Goes to checkout (existing page)
3. **NEW:** Sees coin balance and option to use coins
4. Selects how many coins to use (1 coin = $1 discount)
5. Order is created with coin payment applied
6. Coins are deducted from user's balance

**Implementation:**
```typescript
// Order creation with coins
const order = await ordersApi.createOrderWithCoins(coinsToUse, orderData);
```

### 4. Data Sharing

**User Model (Unified):**
```typescript
interface User {
  // E-commerce fields (existing)
  email: string;
  name: string;
  role: Role;

  // Game fields (new)
  coinBalance: number;
  totalCoinsEarned: number;
  referralCode: string;
  onboardingComplete: boolean;

  // Shared
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Implementation Phases

### Phase 1: Backend Foundation (Week 1-2)

**Tasks:**
- [ ] Create database schema (Prisma migrations)
- [ ] Create Game module structure
- [ ] Implement TasksService
- [ ] Implement CoinsService
- [ ] Implement ReferralsService
- [ ] Implement Progress API
- [ ] Extend User model with game fields
- [ ] Extend AuthService for referral registration
- [ ] Create seed script for initial tasks

**Deliverables:**
- All game APIs functional
- Database migrations complete
- API documentation (Swagger)

### Phase 2: Frontend Implementation (Week 3-4)

**Tasks:**
- [ ] Create game landing page (`/`)
- [ ] Create game dashboard (`/game`)
- [ ] Create task list page (`/game/tasks`)
- [ ] Move existing e-commerce to `/shop`
- [ ] Create game components (CoinBalance, TaskCard, etc.)
- [ ] Implement game API client
- [ ] Extend checkout with coin payment
- [ ] Add navigation between game and shop

**Deliverables:**
- Full game UI functional
- E-commerce unchanged and accessible via `/shop`
- Seamless navigation between game and shop

### Phase 3: Admin Panel (Week 5)

**Tasks:**
- [ ] Create game overview dashboard
- [ ] Create task management pages
- [ ] Create task verification page
- [ ] Create user progress monitoring
- [ ] Create coin management tools
- [ ] Add game section to admin navigation

**Deliverables:**
- Admin can create/edit tasks
- Admin can verify user tasks
- Admin can view user progress
- Admin can manually adjust coins

### Phase 4: Mobile App (Week 6-7)

**Tasks:**
- [ ] Add Game tab to navigation
- [ ] Move existing shop to Shop tab
- [ ] Create mobile game dashboard
- [ ] Create mobile task screens
- [ ] Implement mobile game API hooks
- [ ] Extend checkout with coin payment
- [ ] Test on iOS and Android

**Deliverables:**
- Mobile game fully functional
- Mobile shop unchanged
- Tab navigation working

### Phase 5: Testing & Optimization (Week 8)

**Tasks:**
- [ ] Unit tests for game services
- [ ] Integration tests for APIs
- [ ] E2E tests for complete user flows
- [ ] Performance testing
- [ ] Security audit
- [ ] Bug fixes

**Deliverables:**
- All tests passing
- Performance optimized
- Security hardened

### Phase 6: Launch & Monitoring (Week 9)

**Tasks:**
- [ ] Deploy to production
- [ ] Monitor user adoption
- [ ] Collect feedback
- [ ] Fix critical issues
- [ ] Optimize task delays based on retention data

**Deliverables:**
- Production deployment
- Monitoring dashboards
- User feedback collection system

---

## Testing Strategy

### Backend Tests

**Unit Tests:**
```typescript
describe('CoinsService', () => {
  it('should award coins correctly', async () => {
    const transaction = await coinsService.awardCoins(userId, 50, 'TASK_REWARD', 'Test');
    expect(transaction.amount).toBe(50);
    expect(transaction.balanceAfter).toBe(100); // assuming 50 initial
  });

  it('should prevent negative balance', async () => {
    await expect(
      coinsService.deductCoins(userId, 1000, 'ORDER_REDEMPTION', 'Test')
    ).rejects.toThrow('Insufficient coins');
  });
});
```

**Integration Tests:**
```typescript
describe('Task Completion Flow', () => {
  it('should complete task and award coins', async () => {
    // Start task
    await request(app).post('/api/game/progress/start/task-1').expect(200);

    // Complete task
    const response = await request(app)
      .post('/api/game/progress/complete/task-1')
      .attach('proof', 'test-image.jpg')
      .expect(200);

    expect(response.body.status).toBe('PENDING_VERIFY');

    // Admin verifies
    await request(app)
      .post('/api/game/progress/verify/user-task-1')
      .send({ approved: true })
      .expect(200);

    // Check coin balance
    const balance = await request(app).get('/api/game/coins/balance').expect(200);
    expect(balance.body.balance).toBe(100); // 50 initial + 50 reward
  });
});
```

### Frontend Tests

**Component Tests:**
```typescript
describe('CoinBalance', () => {
  it('renders balance correctly', () => {
    render(<CoinBalance balance={500} totalEarned={750} />);
    expect(screen.getByText('500 Moedas')).toBeInTheDocument();
    expect(screen.getByText('$500.00 USD')).toBeInTheDocument();
  });
});
```

**E2E Tests:**
```typescript
describe('Complete User Journey', () => {
  it('user can register, complete task, and use coins in shop', async () => {
    // Register
    await page.goto('/');
    await page.click('text=Começar a Jornada');
    await page.fill('[name="email"]', 'test@example.com');
    // ... registration

    // Complete first task
    await page.click('text=Começar Agora');
    // ... task completion

    // Go to shop
    await page.click('text=Ver Produtos na Loja');
    expect(page.url()).toContain('/shop');

    // Use coins in checkout
    await page.click('text=Add to Cart');
    await page.click('text=Checkout');
    await page.fill('[name="coinsToUse"]', '50');
    // ... complete checkout
  });
});
```

---

## Security Considerations

### 1. Coin Fraud Prevention

**Measures:**
- Server-side coin balance validation
- Transaction history audit trail
- Rate limiting on task completion
- Admin verification for high-value tasks
- IP-based abuse detection
- Referral fraud detection (same IP, email patterns)

### 2. Task Verification

**Automated Checks:**
- Image analysis for selfie tasks (face detection)
- App install verification (SDK integration)
- Social post verification (API integration)

**Manual Verification:**
- Admin review for subjective tasks
- Flag suspicious patterns
- Review user history before large payouts

### 3. Authentication

**Existing + Enhanced:**
- JWT tokens (existing)
- Refresh token rotation
- Rate limiting on sensitive endpoints
- CSRF protection
- XSS prevention

### 4. Coin Redemption

**Controls:**
- Minimum redemption threshold
- Maximum coins per order
- Fraud detection before payout
- Delayed redemption for new users

---

## Business Model

### Revenue Streams

**1. Affiliate Commissions (Primary)**
```
Affiliate pays for:
- $10 per user registration
- $20 per app install
- $50 per social post
- 10-20% commission on sales from redirected users
```

**2. Brand Sponsorships**
```
Brands pay for:
- Featured tasks (premium placement)
- Sponsored challenges
- Branded content
```

**3. Shop Margin**
```
- Mark up products sold in shop
- Coin redemptions still profitable
```

### Cost Structure

**Fixed Costs:**
- Server infrastructure: $500/month
- Development: $10,000/month
- Support: $2,000/month

**Variable Costs:**
- Coin payouts: 1 coin = $1 (critical!)
- Transaction fees: 2-3%

### Financial Model (Sustainable - Recommended)

**Coin Value Adjustment:**
```
Option A: 1,000 coins = $100 USD (10% of promised value)
Option B: 1,000 coins = $1,000 in DISCOUNTS at partner stores
Option C: Lottery system - 1,000 coins = 1 entry to win $1,000
```

**Break-even Analysis:**
```
Assumptions:
- 10,000 active users
- 10% complete to 1,000 coins (1,000 users)
- Option A: Cost = $100,000 payout
- Affiliate revenue = $150,000 (1,000 users × $150 average)
- Profit = $50,000
```

---

## Success Metrics

### User Engagement
- DAU (Daily Active Users)
- Retention (Day 1, Day 7, Day 30)
- Task completion rate
- Average time to 1,000 coins

### Revenue
- Affiliate revenue per user
- Cost per acquisition
- Lifetime value (LTV)
- Profit margin

### Operational
- Task verification time
- Fraud detection rate
- System uptime
- API response time

---

## Risk Mitigation

### Financial Risk

**Problem:** 1 coin = 1 USD is financially dangerous

**Mitigation:**
1. Start with adjusted value (Option A/B/C above)
2. Cap total coin supply
3. Implement breakage (expiration)
4. Require minimum purchase amount for redemption
5. Limit daily coin earning

### User Churn

**Problem:** Delays may cause abandonment

**Mitigation:**
1. Push notifications for task unlock
2. Daily login bonuses
3. Streak rewards
4. Social features (leaderboards, friends)
5. Surprise bonuses

### Fraud

**Problem:** Users gaming the system

**Mitigation:**
1. Machine learning fraud detection
2. Manual review thresholds
3. Account age requirements
4. KYC for large redemptions
5. IP and device tracking

---

## Conclusion

This plan provides a complete roadmap to add gamification to the existing Experience Club e-commerce platform **WITHOUT removing any existing functionality**. The game and shop will coexist harmoniously, with users able to seamlessly transition between earning coins and spending them.

### Key Principles Maintained:

✅ **No deletion** - All existing e-commerce features remain intact
✅ **Additive only** - New tables, new routes, new components
✅ **Unified system** - Single user, single authentication
✅ **Clear separation** - `/game` and `/shop` namespaces
✅ **Smooth integration** - One-click navigation between game and shop

### Next Steps:

1. Review and approve this plan
2. Set up development environment
3. Begin Phase 1 (Backend Foundation)
4. Iterative development with weekly demos
5. Launch MVP in 8-9 weeks

---

**Document Version:** 2.0.0
**Last Updated:** January 2025
**Status:** ✅ Ready for Implementation
