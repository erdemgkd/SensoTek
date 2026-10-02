/**
 * SensoTek A.Ş. — Tedarikçi & B2B Sipariş Formu Modülü
 * Modüler Yapı: Bağımsız dosya, izole kapsam (IIFE).
 * Sorumluluk: Ürün seçimi, adet doğrulaması, canlı özet ve sipariş gönderim etkileşimi.
 */

(function () {
    'use strict';

    function initOrderForm() {
        const form = document.getElementById('b2b-order-form');
        const productSelect = document.getElementById('order-product');
        const quantityInput = document.getElementById('order-quantity');
        const summaryDesc = document.getElementById('summary-desc');
        const summaryTag = document.getElementById('summary-tag');
        const successCard = document.getElementById('order-success-card');
        const refCodeEl = document.getElementById('ref-code-value');
        const btnReset = document.getElementById('btn-reset-order');

        if (!form) {
            return;
        }

        // Ürün ve adede göre canlı özet güncelleme
        function updateSummary() {
            const product = productSelect.value;
            const quantity = parseInt(quantityInput.value, 10) || 1;

            if (product === 'sensor-kiti') {
                const minPrice = 80 * quantity;
                const maxPrice = 130 * quantity;
                summaryDesc.textContent = `${quantity.toLocaleString('tr-TR')} Adet Sensör Kiti (${minPrice.toLocaleString('tr-TR')} ₺ – ${maxPrice.toLocaleString('tr-TR')} ₺)`;
                summaryTag.textContent = '1.500 Adet Hazır Stok';
            } else if (product === 'smartbox-ulusal') {
                const minPrice = 2300 * quantity;
                const maxPrice = 3000 * quantity;
                summaryDesc.textContent = `${quantity.toLocaleString('tr-TR')} Adet SmartBox Ulusal Pazar (${minPrice.toLocaleString('tr-TR')} ₺ – ${maxPrice.toLocaleString('tr-TR')} ₺)`;
                summaryTag.textContent = 'Doğrudan Satışa Hazır';
            } else if (product === 'smartbox-ihracat') {
                const minPrice = 35 * quantity;
                const maxPrice = 60 * quantity;
                summaryDesc.textContent = `${quantity.toLocaleString('tr-TR')} Adet SmartBox Yurt Dışı Pazarı (${minPrice.toLocaleString('tr-TR')} € – ${maxPrice.toLocaleString('tr-TR')} €)`;
                summaryTag.textContent = 'Gümrük & İhracat Uyumlu';
            } else if (product === 'takas-barter') {
                summaryDesc.textContent = `${quantity.toLocaleString('tr-TR')} Adet Karşılığı Bileşen / Ürün Takası Talebi`;
                summaryTag.textContent = 'Özel Anlaşma & Barter';
            }
        }

        if (productSelect && quantityInput) {
            productSelect.addEventListener('change', updateSummary);
            quantityInput.addEventListener('input', updateSummary);
            updateSummary();
        }

        // Form Gönderimi
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const fullName = document.getElementById('order-fullname').value.trim();
            const company = document.getElementById('order-company').value.trim();
            const email = document.getElementById('order-email').value.trim();
            const product = productSelect.options[productSelect.selectedIndex].text;
            const quantity = quantityInput.value;

            if (!fullName || !company || !email) {
                alert('Lütfen zorunlu alanları (Ad Soyad, Şirket Adı, E-posta) eksiksiz doldurunuz.');
                return;
            }

            // Rastgele Sipariş Referans Kodu Oluştur (örn: STK-2026-9842)
            const randomRef = 'STK-' + Math.floor(1000 + Math.random() * 9000);
            if (refCodeEl) {
                refCodeEl.textContent = randomRef;
            }

            // Formu gizle, başarı kartını göster
            form.style.display = 'none';
            if (successCard) {
                successCard.classList.add('is-visible');
                successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            console.log('Sipariş Talebi Alındı:', {
                ref: randomRef,
                fullName,
                company,
                email,
                product,
                quantity,
                timestamp: new Date().toISOString()
            });
        });

        // Yeni Sipariş Oluştur (Formu Sıfırla)
        if (btnReset) {
            btnReset.addEventListener('click', function () {
                form.reset();
                form.style.display = 'block';
                if (successCard) {
                    successCard.classList.remove('is-visible');
                }
                updateSummary();
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOrderForm);
    } else {
        initOrderForm();
    }
})();
