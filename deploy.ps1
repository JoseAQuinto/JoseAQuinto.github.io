# PARA USAR, ".\deploy.ps1" desde la carpeta JoseAQuinto.github.io


# Build del proyecto React
cd portfolio-react
npm run build

# Volver a la raíz del repo
cd ..

# Limpiar build anterior
Remove-Item .\assets -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item .\index.html -Force -ErrorAction SilentlyContinue

# Copiar nuevo build
Copy-Item .\portfolio-react\dist\* .\ -Recurse -Force

# Commit y push
git add .
git commit -m "Deploy"
git push