
## Building a end to end basic version of PayTM

### Steps to run locally

1) ### frontend:

    1) docker pull avijit2002/paytm_frontend
    2) docker run --name paytm_frontend -p [ANY PORT NO.]:80 avijit2002/paytm_frontend

    OR

    1) cd frontend
    2) docker build . -t paytm_frontend
    3) docker run --name paytm_frontend -p [ANY PORT NO.]:80 -d paytm_frontend
 
 2) ### backend:

    1) docker pull avijit2002/paytm_backend
    2) docker run --name paytm_backend -e JWT_SECRET="ANY STRING" -e DATABASE_URL="YOUR MONGODB URI STRING" -p 3000:3000 avijit2002/paytm_backend

    OR

    1) cd backend
    2) docker build . -t paytm_backend
    3) docker run --name paytm_backend -e JWT_SECRET="ANY STRING" -e DATABASE_URL="YOUR MONGODB URI STRING" -p 3000:3000 avijit2002/paytm_backend