/**
 * SensoTek A.Ş. — Stok, Kapasite, Darboğaz ve Ürün Bulunabilirliği Paneli (Dashboard) Modülü
 * Modüler Yapı: Bağımsız dosya, izole kapsam (IIFE).
 * Sorumluluk: Stok takip senkronizasyonu, interaktif montaj simülatörü ve dinamik darboğaz analizi.
 */

(function () {
    'use strict';

    // SensoTek SmartBox BOM Bileşen Envanter Verileri
    const bomComponents = [
        { id: 'bom-sensor', name: 'Sensör Kiti (G03)', stock: 1500, maxCapacity: 1500, code: 'G03 — SensoTek', isPrimary: true },
        { id: 'bom-kasa', name: 'Kasa ve Ambalaj', stock: 600, maxCapacity: 1500, code: 'G04 — FormAmbalaj' },
        { id: 'bom-enerji', name: 'Enerji Modülü', stock: 650, maxCapacity: 1500, code: 'G01 — EnerjiNova' },
        { id: 'bom-islemci', name: 'İşlemci Modülü', stock: 850, maxCapacity: 1500, code: 'G02 — MikroCore' },
        { id: 'bom-analitik', name: 'Müşteri Analitiği', stock: 900, maxCapacity: 1500, code: 'G07 — VeriPusula' },
        { id: 'bom-garanti', name: 'Garanti Paketi', stock: 1000, maxCapacity: 1500, code: 'G08 — GüvencePlus' },
        { id: 'bom-lojistik', name: 'Lojistik Tokenı', stock: 1100, maxCapacity: 1500, code: 'G06 — HızlıRota' },
        { id: 'bom-yazilim', name: 'Yazılım Lisansı', stock: 1200, maxCapacity: 1500, code: 'G05 — BulutOS' }
    ];

    function initDashboard() {
        const slider = document.getElementById('dash-sim-slider');
        const valDisplay = document.getElementById('dash-sim-val');
        const statusIcon = document.getElementById('dash-sim-icon');
        const statusText = document.getElementById('dash-sim-text');
        const missingText = document.getElementById('dash-sim-missing');

        if (!slider || !valDisplay) {
            return;
        }

        // Simülatör ve dinamik darboğaz hesaplayıcı fonksiyonu
        function updateSimulation() {
            const target = parseInt(slider.value, 10) || 600;
            valDisplay.textContent = target.toLocaleString('tr-TR');

            // Darboğaz kontrolü
            const bottlenecks = [];

            bomComponents.forEach(comp => {
                const itemEl = document.getElementById(comp.id);
                if (!itemEl) return;

                const barEl = itemEl.querySelector('.bom-stock-bar');
                const statusEl = itemEl.querySelector('.bom-stock-status');

                if (comp.stock < target) {
                    const deficit = target - comp.stock;
                    bottlenecks.push({ name: comp.name, deficit: deficit, stock: comp.stock });

                    // Görsel Darboğaz Vurgusu
                    itemEl.classList.add('is-bottleneck');
                    if (barEl) {
                        barEl.className = 'bom-stock-bar bar-danger';
                        const pct = Math.min(100, Math.round((comp.stock / target) * 100));
                        barEl.style.width = pct + '%';
                    }
                    if (statusEl) {
                        statusEl.style.color = '#f87171';
                        statusEl.textContent = `-${deficit.toLocaleString('tr-TR')} Eksik`;
                    }
                } else {
                    itemEl.classList.remove('is-bottleneck');
                    if (barEl) {
                        barEl.className = comp.isPrimary ? 'bom-stock-bar' : 'bom-stock-bar bar-green';
                        const pct = Math.min(100, Math.round((comp.stock / 1500) * 100));
                        barEl.style.width = pct + '%';
                    }
                    if (statusEl) {
                        statusEl.style.color = comp.isPrimary ? 'var(--color-accent-hover)' : '#34d399';
                        statusEl.textContent = comp.isPrimary ? 'Tam Stok' : 'Yeterli';
                    }
                }
            });

            // Simülasyon Sonuç Metinlerini Güncelle
            if (bottlenecks.length === 0) {
                if (statusIcon) statusIcon.textContent = '✅';
                if (statusText) {
                    statusText.textContent = `${target.toLocaleString('tr-TR')} Adet SmartBox mevcut stoklarla eksiksiz montajlanabilir.`;
                    statusText.style.color = '#34d399';
                }
                if (missingText) {
                    missingText.textContent = 'Tüm 8 bileşen depomuzda yeterli miktarda bulunmaktadır. Darboğaz riski yoktur.';
                    missingText.style.color = 'var(--color-text-muted)';
                }
            } else {
                if (statusIcon) statusIcon.textContent = '⚠️';
                if (statusText) {
                    statusText.textContent = `${target.toLocaleString('tr-TR')} Adet için ${bottlenecks.length} bileşende DARBOĞAZ oluştu!`;
                    statusText.style.color = '#fbbf24';
                }
                if (missingText) {
                    const deficitSummary = bottlenecks
                        .map(b => `${b.name}: -${b.deficit.toLocaleString('tr-TR')} adet (Mevcut: ${b.stock})`)
                        .join(' | ');
                    missingText.innerHTML = `<strong>Kritik Eksiklik:</strong> ${deficitSummary}.<br><span style="color:#38bdf8;">Öneri:</span> Bu parçalar için diğer şirketlerle acil takas (barter) veya B2B alım yapılmalıdır.`;
                    missingText.style.color = '#fca5a5';
                }
            }
        }

        // Slider değiştiğinde canlı tetikle
        slider.addEventListener('input', updateSimulation);

        // İlk açılışta çalıştır
        updateSimulation();
    }

    // DOM yüklendiğinde otomatik başlat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDashboard);
    } else {
        initDashboard();
    }
})();
