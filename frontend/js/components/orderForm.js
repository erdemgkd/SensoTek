/**
 * SensoTek A.Ş. — Sipariş Formu ve Otomatik E-Posta Taslak İletim Modülü
 * Modüler Yapı: Bağımsız dosya, izole kapsam (IIFE).
 * Sorumluluk: Ürün seçimi, adet doğrulaması, canlı özet, e-posta taslağı oluşturma ve iletim yönetimi.
 * Hedef E-Posta: sensotek03@gmail.com
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
        const dispatchCompanyEl = document.getElementById('dispatch-company');
        const dispatchProductEl = document.getElementById('dispatch-product');
        const emailPreviewEl = document.getElementById('email-preview-content');
        const btnSendGmail = document.getElementById('btn-send-gmail');
        const btnSendMailto = document.getElementById('btn-send-mailto');
        const btnCopyDraft = document.getElementById('btn-copy-draft');
        const copyBtnText = document.getElementById('copy-btn-text');
        const btnReset = document.getElementById('btn-reset-order');

        if (!form) {
            return;
        }

        let currentDraftText = '';

        // Ürün ve adede göre canlı özet güncelleme
        function updateSummary() {
            const product = productSelect.value;
            const quantity = parseInt(quantityInput.value, 10) || 1;

            if (product === 'sensor-kiti') {
                const minPrice = 60 * quantity;
                const maxPrice = 90 * quantity;
                summaryDesc.textContent = `${quantity.toLocaleString('tr-TR')} Adet Sensör Kiti (${minPrice.toLocaleString('tr-TR')} ₺ – ${maxPrice.toLocaleString('tr-TR')} ₺)`;
                summaryTag.textContent = '1.500 Adet Hazır Stok';
            } else if (product === 'smartbox-ulusal') {
                const minPrice = 750 * quantity;
                const maxPrice = 1000 * quantity;
                summaryDesc.textContent = `${quantity.toLocaleString('tr-TR')} Adet SmartBox (${minPrice.toLocaleString('tr-TR')} ₺ – ${maxPrice.toLocaleString('tr-TR')} ₺)`;
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

        // Form Gönderimi & Otomatik E-Posta Taslağı Oluşturma
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const fullName = document.getElementById('order-fullname').value.trim();
            const company = document.getElementById('order-company').value.trim();
            const email = document.getElementById('order-email').value.trim();
            const phone = document.getElementById('order-phone') ? document.getElementById('order-phone').value.trim() || 'Belirtilmedi' : 'Belirtilmedi';
            const productText = productSelect.options[productSelect.selectedIndex].text;
            const quantity = parseInt(quantityInput.value, 10) || 1;
            const paymentSelect = document.getElementById('order-payment-type');
            const paymentText = paymentSelect ? paymentSelect.options[paymentSelect.selectedIndex].text : 'Peşin Ödeme';
            const notesEl = document.getElementById('order-notes');
            const notes = notesEl && notesEl.value.trim() ? notesEl.value.trim() : 'Özel sipariş notu bulunmamaktadır.';

            if (!fullName || !company || !email) {
                alert('Lütfen zorunlu alanları (Ad Soyad, Şirket Adı, Kurumsal E-posta) eksiksiz doldurunuz.');
                return;
            }

            // Rastgele Takip & Referans Kodu (örn: STK-2026-7492)
            const randomRef = 'STK-2026-' + Math.floor(1000 + Math.random() * 9000);
            const now = new Date();
            const dateStr = now.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' +
                            now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

            const targetRecipient = 'sensotek03@gmail.com';
            const simpleProductName = productText.split('(')[0].trim();
            const emailSubject = `[SensoTek Sipariş Talebi] Ref: ${randomRef} - ${company} (${simpleProductName})`;

            // Profesyonel Kurumsal E-Posta Taslak Metni
            const emailBody = 
`Sayın SensoTek A.Ş. Yönetimi ve Satış Departmanı,

Aşağıda detayları belirtilen ürün ve adetler için kurumsal B2B sipariş ve teklif talebimizi bilgilerinize sunarız:

═══════════════════════════════════════════════════════
📋 SİPARİŞ VE TALEP DETAYLARI
═══════════════════════════════════════════════════════
• Sipariş Referans No : ${randomRef}
• Talep Tarihi        : ${dateStr}
• Talep Edilen Ürün   : ${productText}
• Talep Edilen Adet   : ${quantity.toLocaleString('tr-TR')} Adet
• Tahmini Fiyat Hacmi : ${summaryDesc.textContent}
• Ödeme & Teslimat    : ${paymentText}

═══════════════════════════════════════════════════════
🏢 ALICI / ŞİRKET İLETİŞİM BİLGİLERİ
═══════════════════════════════════════════════════════
• Yetkili Ad Soyad    : ${fullName}
• Şirket / Kurum Adı  : ${company}
• Kurumsal E-Posta    : ${email}
• Telefon Numarası    : ${phone}

═══════════════════════════════════════════════════════
📝 SİPARİŞ NOTU / ÖZEL TALEPLER
═══════════════════════════════════════════════════════
${notes}

═══════════════════════════════════════════════════════
Talebimizin incelenerek tarafımıza resmi sipariş onayı ve proforma faturanın iletilmesini rica ederiz.

Saygılarımızla,
${fullName} — ${company}`;

            currentDraftText = emailBody;

            // DOM Elemanlarını Doldur
            if (refCodeEl) refCodeEl.textContent = randomRef;
            if (dispatchCompanyEl) dispatchCompanyEl.textContent = `${company} (${fullName})`;
            if (dispatchProductEl) dispatchProductEl.textContent = `${quantity.toLocaleString('tr-TR')} Adet ${simpleProductName}`;
            if (emailPreviewEl) emailPreviewEl.textContent = emailBody;

            // Gmail Web URL'si
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetRecipient)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
            if (btnSendGmail) {
                btnSendGmail.href = gmailUrl;
            }

            // Standart Mailto URL'si (Outlook, Apple Mail, Windows Mail)
            const mailtoUrl = `mailto:${targetRecipient}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
            if (btnSendMailto) {
                btnSendMailto.href = mailtoUrl;
            }

            // Formu gizle, E-Posta İletim Merkezini göster
            form.style.display = 'none';
            if (successCard) {
                successCard.classList.add('is-visible');
                successCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        // Metin Taslağını Panoya Kopyalama Butonu
        if (btnCopyDraft && copyBtnText) {
            btnCopyDraft.addEventListener('click', function () {
                if (!currentDraftText) return;

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(currentDraftText).then(onCopySuccess).catch(fallbackCopy);
                } else {
                    fallbackCopy();
                }

                function fallbackCopy() {
                    const tempTextarea = document.createElement('textarea');
                    tempTextarea.value = currentDraftText;
                    document.body.appendChild(tempTextarea);
                    tempTextarea.select();
                    try {
                        document.execCommand('copy');
                        onCopySuccess();
                    } catch (err) {
                        alert('Taslak panoya kopyalanamadı, lütfen önizleme alanından manuel seçip kopyalayınız.');
                    }
                    document.body.removeChild(tempTextarea);
                }

                function onCopySuccess() {
                    const originalText = copyBtnText.textContent;
                    copyBtnText.textContent = 'Metin Kopyalandı! ✓';
                    btnCopyDraft.classList.add('copied');

                    setTimeout(function () {
                        copyBtnText.textContent = originalText;
                        btnCopyDraft.classList.remove('copied');
                    }, 2500);
                }
            });
        }

        // Yeni Sipariş Oluştur (Formu Sıfırla)
        if (btnReset) {
            btnReset.addEventListener('click', function () {
                form.reset();
                form.style.display = 'block';
                if (successCard) {
                    successCard.classList.remove('is-visible');
                }
                updateSummary();
                form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }

        // Ürün kartlarındaki "Sipariş Formu Oluştur" butonları
        const productSelectTriggers = document.querySelectorAll('[data-product-select]');
        productSelectTriggers.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const targetProduct = btn.getAttribute('data-product-select');
                if (targetProduct && productSelect) {
                    productSelect.value = targetProduct;
                    updateSummary();
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOrderForm);
    } else {
        initOrderForm();
    }
})();
