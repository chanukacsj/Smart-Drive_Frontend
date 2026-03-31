# Step 1: Build Stage
# Node.js image එකක් පාවිච්චි කරලා React app එක build කරනවා
FROM node:18-alpine AS build
WORKDIR /app

# Dependency file විතරක් මුලින්ම copy කරනවා (build speed එක වැඩි කරන්න)
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# Cloud Run සාමාන්‍යයෙන් 8080 port එක බලාපොරොත්තු වෙන නිසා Nginx configuration එක වෙනස් කරනවා
RUN sed -i 's/listen[[:space:]]*80;/listen 8080;/g' /etc/nginx/conf.d/default.conf

# 8080 port එක open කරනවා
EXPOSE 8080

# Nginx පණගන්වනවා
CMD ["nginx", "-g", "daemon off;"]