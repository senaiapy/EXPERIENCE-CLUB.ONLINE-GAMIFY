docker inspect containername to show ip and networks

docker-compose -f docker-compose.dev.yml exec -T backend npx prisma generate
      --force

docker-compose -f docker-compose.dev.yml stop backend

docker-compose -f docker-compose.dev.yml build --no-cache backend

docker-compose -f docker-compose.dev.yml down

docker-compose -f docker-compose.dev.yml up -d
      sleep 15 && docker-compose -f docker-compose.dev.yml logs backend

docker-compose -f docker-compose.dev.yml rm -f backend    

docker-compose -f docker-compose.dev.yml restart enviosya_backend_dev

docker-compose -f docker-compose.dev.yml build backend

docker-compose -f docker-compose.dev.yml up -d backend

docker exec enviosya_backend_dev npx prisma generate

docker exec enviosya_backend_dev sh -c "unset PRISMA_QUERY_ENGINE_LIBRARY && cd /app && npx prisma generate"

docker exec enviosya_postgres_dev pg_dump -U enviosya enviosya >  backend/sql/backup-$(date +%Y%m%d-%H%M%S).sql 

docker-compose -f docker-compose.dev.yml run --rm backend npm run build

npx prisma generate Generate Prisma client from schema 

docker-compose exec -T backend env | grep DATABASE_URL


docker-compose exec -T backend npm run migrate:php-images

docker stop $(docker ps -aq) && docker rm $(docker ps -aq)

docker-compose up

docker-compose down -v && docker-compose up -d

docker-compose exec -T backend npm run seed:admin

docker-compose restart clubdeofertas_admin

curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 && echo " - Frontend (port
      3000)"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 && echo " - Admin (port
      3001)"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3002 && echo " - Backend (port
      3002)"            


      docker-compose -f docker-compose.prod.yml up --build -d

curl -s http://localhost:3002/api | head -10


docker-compose down frontende && docker-compose build --no-cache frontend

docker-compose down && docker-compose up -d
sleep 10 && curl -s "http://localhost:3000/categoria/perfumes-masculinos-disenador"
      | head -50

docker-compose up -d frontend admin

docker rm -fv $(docker ps -aq)
docker rmi $(docker images -a -q)
docker system prune -a

 docker volume prune -f 

docker-compose build --no-cache frontend
docker-compose restart frontend
docker-compose exec -T frontend sh -c "curl -s 'http://backend:3002/api/brands' | head -3"
docker-compose exec -T backend npx prisma studio --browser none &
docker-compose exec -T postgres psql -U clubdeofertas -d clubdeofertas
      -c "SELECT 'Users:' as table_name, COUNT(*) as count FROM \"User\" UNION
       SELECT 'Brands:'…

##------------------------COMPLETE BUILD---------------------------------
c
npm run docker:down

cd typescript/admin && sudo npm run clean && rm -rf .next && cd ../ ../ ..      
cd typescript/frontend && sudo npm run clean && rm -rf .next && cd ../ ../ ..
cd typescript/backend && sudo chmod -R 777 dist || true && rm -rf dist && cd ../ ../ ..

d typescript/frontend && npm install && cd ../..
cd typescript/admin && npm install && cd ../..
cd typescript/backend && npm install && cd ../..      


cd typescript/admin && npm run build && cd ../..
cd typescript/frontend && npm run build && cd ../..
cd typescript/backend && npx prisma generate && cd ../..
cd typescript/backend && npm run build && cd ../..

npm run docker:build
docker-compose up --build -d
docker-compose ps -a
sleep 10 && npm run docker:migrate:dev --force
npm run docker:seed
docker-compose logs --tail=10

 Use credentials: admin@clubdeofertas.com / admin123
#--------------------------SIMPLE BUILD-------------------------------
npm run docker:down
docker-compose up --build -d
sleep 10 && docker ps
curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/api
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001

lsof -ti:3052 | xargs kill -9

sshpass -p '@server' ssh -o StrictHostKeyChecking=no root@217.79.189.223 'cd CLUBDEOFERTAS.COM.PY && chmod +x setup-deploy.sh && ./setup-deploy.sh 2>&1 | tee deploy.log'

To pull only the current branch (storage) to a remote folder, you can use these Git commands:
Option 1: Clone only the specific branch (if starting fresh)
git clone -b storage --single-branch <repository-url> <destination-folder>
Example:
git clone -b storage --single-branch https://github.com/username/repo.git /path/to/remote/folder
Option 2: If the repository already exists in the remote folder
cd /path/to/remote/folder
git fetch origin storage
git checkout storage
git pull origin storage
Option 3: Pull only the storage branch without switching
cd /path/to/remote/folder
git fetch origin storage:storage
Option 4: Set up tracking and pull (recommended for ongoing work)
cd /path/to/remote/folder
git checkout -b storage origin/storage
git pull
For your specific case (storage branch):
Since you're on the storage branch and want to deploy it to a remote server:
# On remote server
git clone -b storage --single-branch <your-repo-url> /path/to/deployment/folder

# Or if repo already exists
cd /path/to/deployment/folder
git fetch origin
git checkout storage
git pull origin storage
This will ensure only the storage branch code is pulled without any other branches.
an to update a folder with old main branch
To update a folder that has the old main branch with the current storage branch, you have several options:
Option 1: Replace main branch content with storage branch
cd /path/to/folder
git fetch origin
git checkout main
git reset --hard origin/storage
git push origin main --force
⚠️ Warning: This overwrites the main branch with storage branch content
Option 2: Merge storage branch into main
cd /path/to/folder
git checkout main
git pull origin main
git merge origin/storage
git push origin main
Option 3: Update local folder without affecting remote
cd /path/to/folder
git fetch origin
git checkout storage
git pull origin storage
Option 4: Pull storage branch changes into main (preserving history)
cd /path/to/folder
git checkout main
git pull origin main
git pull origin storage
# Resolve any conflicts if they occur
git push origin main
Option 5: Fresh clone with storage branch
# Backup old folder first
mv /path/to/folder /path/to/folder.backup

# Clone storage branch
git clone -b storage <repository-url> /path/to/folder
Recommended approach for your scenario:
Since you want to update a folder with the old main branch to use the storage branch:
cd /path/to/folder

# Check current branch
git branch

# Fetch latest changes
git fetch origin

# Switch to storage branch
git checkout storage

# Pull latest storage branch
git pull origin storage
If you want to replace the main branch with storage:
cd /path/to/folder
git checkout main
git pull origin main
git merge origin/storage -X theirs
git push origin main
The -X theirs flag automatically resolves conflicts by taking the storage branch version.

lsof -ti:3080 | xargs kill -9 2>/dev/null || echo "No process on port 3080"

ANTHROPIC_BASE_URL=https://api.z.ai/api/anthropic ANTHROPIC_AUTH_TOKEN=a3cb9c0b97824f63a93101cb325e5b0e.1CD9Mw1GYqLhnMk9 claud