# Gunakan image Node.js yang ringan
FROM node:18-alpine

# Set folder kerja di dalam container
WORKDIR /app

# ---- PERBAIKAN FINAL UNTUK RAILWAY BUILD CONTEXT ----

# Salin package.json DARI LOKASI ASLI (backend/) KE DALAM KONTAINER
# Kita harus menggunakan path relatif dari root repository: backend/package*.json
COPY backend/package*.json ./

# Install library backend (akan berhasil karena package.json sudah ada di /app)
RUN npm install

# Salin sisa kode backend DARI LOKASI ASLI KE DALAM KONTAINER
# Salin semua isi folder backend/ ke dalam folder /app di kontainer
COPY backend/. .

# ---- AKHIR PERBAIKAN ----

# Buka port 3000
EXPOSE 3000

# Jalankan server
CMD ["node", "server.js"]