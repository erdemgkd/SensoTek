// Menü linklerine tıklandığında yumuşak kaydırma (Smooth Scroll)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if(targetSection) {
            // Header yüksekliği kadar boşluk bırakarak kaydır
            const headerHeight = document.querySelector('header').offsetHeight;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
  
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});