# Gunakan image Node.js yang ringan
FROM node:18-alpine

# Set folder kerja di dalam container
WORKDIR /app

# Copy file package.json dulu (biar cache lebih efisien)
COPY package*.json ./

# Install library backend
RUN npm install

# Copy sisa kode backend
COPY . .

# Buka port 3000
EXPOSE 3000

# Jalankan server
CMD ["node", "server.js"]