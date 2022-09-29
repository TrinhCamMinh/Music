const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playlist = $('.playlist');
const player = $('.player');
const playButton = $('.btn-toggle-play');
const progress = $('#progress');
const nextButton = $('.btn-next');
const prevButton = $('.btn-prev');
const randomButton = $('.btn-random');
const repeatButton = $('.btn-repeat');
const volumeProgress = $('.volume-progress');
const volumeIcon = $('.volume-setting i');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeated: false,
    isMuted: false,
    songs: [
        {
            name: 'Theres No One At All',
            singer: 'Sơn Tùng MTP',
            path: './music/Theres-No-One-At-All-Son-Tung-M-TP.mp3',
            image: 'https://cdnmedia.thethaovanhoa.vn/Upload/XmJnTp3BYsa9r8REW2g/files/2022/04/son-tung-m-tp.JPG',
        },
        {
            name: 'Waing For You',
            singer: 'Mono',
            path: './music/Waiting For You.mp3',
            image: 'https://avatar-ex-swe.nixcdn.com/song/share/2022/08/17/e/a/a/5/1660733423986.jpg',
        },
        {
            name: 'Như Những Phút Ban Đầu',
            singer: 'Hoài Lâm',
            path: './music/nhuphutbandau.mp3',
            image: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/covers/7/c/7c6be286dd1c9831e37a14eca4016975_1467343706.jpg',
        },

        {
            name: '3107(Cover)',
            singer: '3107',
            path: './music/3107-Cover-Music-30-365.mp3',
            image: 'https://lyricvn.com/wp-content/uploads/2020/03/61b35411029c6156973232016738c1b7.jpg',
        },
        {
            name: 'Buông Đôi Tay Nhau Ra',
            singer: 'Sơn Tùng MTP',
            path: './music/Buong-Doi-Tay-Nhau-Ra-Son-Tung-M-TP.mp3',
            image: 'https://upload.wikimedia.org/wikipedia/vi/c/c0/Buongdoitaynhauramtp.jpg',
        },
        {
            name: 'We Dont Talk Anymore',
            singer: 'Charlie Puth',
            path: './music/We Don_t Talk Anymore - Charlie Puth_ Se.mp3',
            image: 'https://upload.wikimedia.org/wikipedia/vi/8/89/Wedonttalkanymore.jpg',
        },
        {
            name: 'Anh Đã Quen Với Cô Đơn',
            singer: 'Soobin Hoàng Sơn',
            path: './music/Anh-Da-Quen-Voi-Co-Don-Soobin-Hoang-Son.mp3',
            image: 'https://i.scdn.co/image/ab67616d0000b2732922307c16bb852a0849bea0',
        },
        {
            name: 'Lần Cuối',
            singer: 'Karik',
            path: './music/Lan-Cuoi-Karik.mp3',
            image: 'https://avatar-ex-swe.nixcdn.com/song/2021/03/09/c/3/5/4/1615261605117.jpg',
        },
        {
            name: 'Say Do You',
            singer: 'Tiên Tiên',
            path: './music/Say-You-Do-Tien-Tien.mp3',
            image: 'https://imgt.taimienphi.vn/cf/Images/hi/2018/3/22/loi-bai-hat-say-you-do.jpg',
        },
        {
            name: 'Cơn Mưa Rào',
            singer: 'JSOL',
            path: './music/Con-Mua-Rao-JSOL.mp3',
            image: 'https://imgt.taimienphi.vn/cf/Images/hi/2018/6/22/loi-bai-hat-con-mua-rao.jpg',
        },
    ],
    render: function () {
        const htmls = app.songs.map((item, index) => {
            return `
                <div class="song ${index === app.currentIndex ? 'active' : ''}" index=${index}>
                    <div
                        class="thumb"
                        style="background-image: url('${item.image}')"
                    ></div>
                    <div class="body">
                        <h3 class="title">${item.name}</h3>
                        <p class="author">${item.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>
            `;
        });
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: () => {
        Object.defineProperty(app, 'currentSong', {
            //getter do not need to be called exactly (currentSong.get())
            //just type app.currentSong then getter will be called automatically
            get: () => {
                return app.songs[app.currentIndex];
            },
        });
    },
    handleEvents: () => {
        const cdThumbAnimate = cdThumb.animate([{ transform: 'rotate(360deg)' }], {
            duration: 10000, //10s
            iterations: Infinity,
        });

        cdThumbAnimate.pause();

        //shrink when scroll
        const cdWidth = cd.offsetWidth;
        document.addEventListener('scroll', () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const cdNewWidth = cdWidth - scrollTop;
            cd.style.width = cdNewWidth > 0 ? `${cdNewWidth}px` : 0;
            cd.style.opacity = cdNewWidth / cdWidth;
        });

        //play event
        playButton.addEventListener('click', () => {
            if (app.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        });

        //when song is playing
        audio.addEventListener('play', () => {
            app.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        });

        //when song is pausing
        audio.addEventListener('pause', () => {
            app.isPlaying = false;
            player.classList.remove('playing');
        });

        //keep track of the process of the song
        audio.addEventListener('timeupdate', () => {
            progress.value = (audio.currentTime / audio.duration) * 100;
        });

        //fire if the input progress change
        progress.addEventListener('change', () => {
            const seekTime = (audio.duration / 100) * progress.value;
            audio.currentTime = seekTime;
        });

        //next song
        nextButton.addEventListener('click', () => {
            if (!app.isRandom) {
                app.nextSong();
                audio.play();
            } else {
                app.randomSong();
                audio.play();
            }
            app.render();
            app.scrollToActiveSong();
        });

        //previous song
        prevButton.addEventListener('click', () => {
            if (!app.isRandom) {
                app.prevSong();
                audio.play();
            } else {
                app.randomSong();
                audio.play();
            }
            app.render();
            app.scrollToActiveSong();
        });

        //repeat song
        repeatButton.addEventListener('click', () => {
            app.isRepeated = !app.isRepeated;
            repeatButton.classList.toggle('active', app.isRepeated);
        });

        //random song
        randomButton.addEventListener('click', () => {
            app.isRandom = !app.isRandom;
            randomButton.classList.toggle('active', app.isRandom);
        });

        //play next song when the current song ended
        audio.addEventListener('ended', () => {
            if (app.isRepeated) {
                audio.loop = true;
            } else {
                nextButton.click();
            }
        });

        //volume setting
        volumeProgress.addEventListener('change', () => {
            audio.volume = volumeProgress.value / 100;
        });

        //muted when click volume icon
        volumeIcon.addEventListener('click', () => {
            if (!app.isMuted) {
                app.isMuted = true;
                audio.volume = 0;
                volumeProgress.value = 0;
                volumeIcon.className = 'fa-sharp fa-solid fa-volume-xmark';
            } else {
                app.isMuted = false;
                audio.volume = 0.5;
                volumeProgress.value = 50;
                volumeIcon.className = 'fa-solid fa-volume-high';
            }
        });

        //play song when click on the song
        playlist.addEventListener('click', (e) => {
            if (e.target.closest('.song:not(.active)') || e.target.closest('.option')) {
                if (e.target.closest('.song:not(.active)')) {
                    app.currentIndex = Number(e.target.closest('.song:not(.active)').getAttribute('index'));
                    app.loadCurrentSong();
                    app.render();
                    audio.play();
                }
            }
        });
    },
    scrollToActiveSong: () => {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }, 300);
    },
    loadCurrentSong: () => {
        heading.textContent = app.currentSong.name;
        cdThumb.style.backgroundImage = `url('${app.currentSong.image}')`;
        audio.src = app.currentSong.path;
    },
    nextSong: () => {
        app.currentIndex++;
        if (app.currentIndex > app.songs.length - 1) {
            app.currentIndex = 0;
        }
        app.loadCurrentSong();
    },
    prevSong: () => {
        app.currentIndex--;
        if (app.currentIndex < 0) {
            app.currentIndex = app.songs.length;
        }
        app.loadCurrentSong();
    },
    randomSong: () => {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * app.songs.length);
        } while (newIndex === app.currentIndex);
        app.currentIndex = newIndex;
        app.loadCurrentSong();
    },
    start: function () {
        app.defineProperties();
        app.handleEvents();
        app.loadCurrentSong();
        app.render();
    },
};

app.start();
