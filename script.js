function toggleMenu() {
    const menuContent = document.getElementById('menuContent');
    menuContent.style.display = menuContent.style.display === 'block' ? 'none' : 'block';
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function setToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Kayıt Ol formunu işleme
document.getElementById('kayitForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = {
        email: formData.get('email'),
        isim: formData.get('isim'),
        okul: formData.get('okul'),
        il: formData.get('il'),
        ilce: formData.get('ilce'),
        okulNumarasi: formData.get('okulNumarasi'),
        sifre: formData.get('sifre'),
        puan: 0,
        teslimler: []
    };

    const users = getFromLocalStorage('users');
    users.push(userData);
    setToLocalStorage('users', users);

    alert('Kayıt başarılı!');
    event.target.reset();
});

// Veri Görme formunu işleme
document.getElementById('veriGoruntulemeForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const sifre = formData.get('sifre');

    const users = getFromLocalStorage('users');
    const user = users.find(u => u.email === email && u.sifre === sifre);

    if (user) {
        document.querySelector('.left-info').style.display = 'block';
        document.querySelector('.right-info').style.display = 'block';
        document.getElementById('veriGoruntulemeIsim').innerText = user.isim;
        document.getElementById('veriGoruntulemePuan').innerText = user.puan || '0';

        const teslimlerList = document.getElementById('gecmisTeslimler');
        teslimlerList.innerHTML = '';
        user.teslimler.forEach(teslim => {
            const li = document.createElement('li');
            li.textContent = `${teslim.teslimEden} - ${teslim.atikTuru} - ${teslim.atikKutlesi} kg - Puan: ${teslim.puan}`;
            teslimlerList.appendChild(li);
        });
    } else {
        alert('Bilgiler uyuşmuyor, lütfen tekrar deneyin.');
    }
});

// Veri Girişi formunu işleme
document.getElementById('veriGirisiForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Puan hesaplama
    let puan = 0;
    switch (data.atikTuru.toLowerCase()) {
        case 'kağıt':
            puan = data.atikKutlesi * 10;
            break;
        case 'plastik':
            puan = data.atikKutlesi * 15;
            break;
        case 'cam':
            puan = data.atikKutlesi * 20;
            break;
        case 'metal':
            puan = data.atikKutlesi * 25;
            break;
        case 'elektronik atıklar':
            puan = data.atikKutlesi * 50;
            break;
    }
    if (data.hataliAyrisim === 'evet') {
        puan -= 5;
    }
    data.puan = puan;

    // Kullanıcı verilerini güncelle
    const users = getFromLocalStorage('users');
    const user = users.find(u => u.okul === data.okulIsmi && u.okulNumarasi === data.okulNumarasi);

    if (user) {
        user.puan += puan;
        user.teslimler.push(data);
        setToLocalStorage('users', users);
        alert('Veri girişi başarılı! Toplam puanınız: ' + user.puan);
    } else {
        alert('Kullanıcı verisi bulunamadı.');
    }

    event.target.reset();
});

// İl ve ilçe verileri
const iller = {
    "Adana": ["Seyhan", "Çukurova", "Yüreğir", "Sarıçam"],
    "Ankara": ["Çankaya", "Keçiören", "Yenimahalle", "Mamak"],
    "İstanbul": ["Beşiktaş", "Kadıköy", "Üsküdar", "Şişli"],
    // Diğer iller ve ilçeler
};

// İller dropdown'u doldur
const ilSelect = document.getElementById('kayitIl');
const ilceSelect = document.getElementById('kayitIlce');

Object.keys(iller).forEach(il => {
    const option = document.createElement('option');
    option.value = il;
    option.textContent = il;
    ilSelect.appendChild(option);
});

// İlçeler dropdown'unu doldur
ilSelect.addEventListener('change', function() {
    ilceSelect.innerHTML = '';
    const selectedIl = iller[ilSelect.value];
    selectedIl.forEach(ilce => {
        const option = document.createElement('option');
        option.value = ilce;
        option.textContent = ilce;
        ilceSelect.appendChild(option);
    });
});

// İlk il seçildiğinde ilçeleri göster
document.addEventListener('DOMContentLoaded', () => {
    if (ilSelect.value) {
        const selectedIl = iller[ilSelect.value];
        selectedIl.forEach(ilce => {
            const option = document.createElement('option');
            option.value = ilce;
            option.textContent = ilce;
            ilceSelect.appendChild(option);
        });
    }
});
