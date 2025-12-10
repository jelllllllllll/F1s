# Gunakan image Node.js yang ringan
FROM node:18-alpine

# Set folder kerja di dalam container
WORKDIR /app

# ---- START PERUBAHAN UNTUK FIX RAILWAY BUILD CONTEXT ----

# 1. Salin package*.json ke folder sementara /tmp
# Ini mengatasi masalah di mana package.json tidak ditemukan saat build
COPY package*.json /tmp/

# 2. Masuk ke folder sementara dan instal dependensi di sana
RUN cd /tmp && npm install

# 3. Pindahkan hasil instalasi (node_modules) ke folder kerja utama (/app)
RUN mv /tmp/node_modules /app/node_modules

# ---- END PERUBAHAN ----

# Copy sisa kode backend ke folder kerja utama (/app)
COPY . /app

# Buka port 3000
EXPOSE 3000

# Jalankan server
CMD ["node", "server.js"]