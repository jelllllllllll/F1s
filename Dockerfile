# Gunakan image Nginx (Web Server ringan)
FROM nginx:alpine

# Copy semua file HTML, JS, JSON, dan folder resources ke folder html Nginx
COPY *.html /usr/share/nginx/html/
COPY *.js /usr/share/nginx/html/
COPY *.json /usr/share/nginx/html/
COPY resources /usr/share/nginx/html/resources/

# Buka port 80 (Port standar web)
EXPOSE 80

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]