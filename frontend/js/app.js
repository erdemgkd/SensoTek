/**
 * SensoTek A.Ş. — Ana Uygulama Giriş Noktası (App Entry)
 * Modüler mimaride tüm bileşenler buradan başlatılır.
 */

import { initNavbar } from './components/navbar.js';

document.addEventListener('DOMContentLoaded', () => {
    // Navigasyon ve Mobil Menüyü Başlat
    initNavbar();

    console.log('SensoTek A.Ş. modüler web platformu başarıyla yüklendi.');
});
