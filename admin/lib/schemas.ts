import { z } from 'zod';

// Product schemas
export const ProductSchema = z.object({
  ID: z.string(),
  CATEGORIA: z.string(),
  NOME: z.string(),
  DISPONIBILIDADE: z.string(),
  REF: z.string(),
  TAGS: z.string(),
  marca: z.string(),
  DESCRICAO: z.string(),
  ESPECIFICACAO: z.string().optional(),
  DESCRICAO_COMPLETA: z.string().optional(),
  PRECO: z.string(),
  PRECO_VENTA: z.string(),
  IMAGEM: z.string(),
});

export const BrandProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.string(),
  category: z.string(),
  price: z.string(),
  image: z.string().optional(),
  description: z.string().optional(),
});

// User schemas
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  createdAt: z.string().datetime().optional(),
});

// Auth schemas
export const LoginSchema = z.object({
  email: z.string().email('Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const RegisterSchema = z.object({
  email: z.string().email('Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Search schemas
export const SearchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(24),
  category: z.string().optional(),
  brand: z.string().optional(),
});

// Contact form schema
export const ContactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Types derived from schemas
export type Product = z.infer<typeof ProductSchema>;
export type BrandProduct = z.infer<typeof BrandProductSchema>;
export type User = z.infer<typeof UserSchema>;
export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
export type SearchParams = z.infer<typeof SearchSchema>;
export type ContactFormData = z.infer<typeof ContactSchema>;