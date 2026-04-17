# Ta'lim Loyihasi Setup Qo'llanmasi

Ushbu loyiha PHP, MySQL va Vanilla JavaScript (Bootstrap 5) yordamida yaratilgan to'liq stekli o'quv loyihasidir.

## 1. Bazani Sozlash (MySQL)
- `phpMyAdmin` yoki boshqa SQL instrumentini oching.
- `education_db` nomli baza yarating.
- `database/schema.sql` fayli ichidagi SQL kodni bazada ishga tushiring.

## 2. Serverni Ishga Tushirish
- Fayllarni `xampp/htdocs` yoki `laragon/www` papkasiga joylashtiring.
- `backend/db.php` faylini ochib, ma'lumotlar bazasi paroli (`$pass`) to'g'riligini tekshiring (odatda bo'sh bo'ladi).
- Brauzerda `http://localhost/rar/frontend/index.html` manzilini oching.

## 3. Demo Akkauntlar
Siz quyidagi ma'lumotlar bilan kirishingiz mumkin:
- **Email:** `admin@example.com`
- **Parol:** `password`
- (Login formasida CAPTCHA kodini kiritishni unutmang!)

## 4. Xususiyatlar
- **Auth:** Login/Registratsiya va CAPTCHA.
- **CRUD:** Postlar yaratish, o'qish va o'chirish (Rasm yuklash bilan).
- **REST API:** `api/posts.php` orqali JSON ma'lumotlar bilan ishlash.
- **PWA:** Saytni telefoningizga o'rnatish imkoniyati (Manifest + Service Worker).
- **AJAX:** Sahifani yangilamasdan ma'lumotlar bilan ishlash (Fetch API).

## 5. Laravel Versiyasi (Ixtiyoriy)
Agar Laravelda CRUD kerak bo'lsa:
1. `composer create-project laravel/laravel my-app`
2. `php artisan make:model Post -mcr`
3. Controllerda `index`, `store`, `update`, `destroy` metodlarini yozing.
4. `api.php` routeriga yo'llarni qo'shing.
