FROM nginx:alpine

# Copy everything in the frontend folder to nginx root
COPY . /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
