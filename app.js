let play = document.querySelector("#play");
let prev = document.querySelector("#prev");
let next = document.querySelector("#next");

let songName = document.querySelector(".play-song");
let songPic = document.querySelector(".cob-album");
let playlistBox = document.querySelector("#playlistBox");

async function getSongs(){
    let song = await fetch("http://127.0.0.1:5500/song/");
    let response = await song.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let a = div.getElementsByTagName("a");
    // console.log(a);
    let songs = [];

    for (let idx=0; idx < a.length; idx++){
        let el = a[idx];
        if (el.href.endsWith(".mp3")) {
            songs.push(el.href.split("/song/")[1]);
        }
    }

    return songs
}
playSong();
let currentSong = new Audio();

function playMusic(music){
    let audio = new Audio("/song/" + music);
    currentSong.src = "/song/" + music;
    currentSong.play();
}
function playTrack(music){
    let audio = new Audio("/song/" + music);
    currentSong.src = "/song/" + music;
    currentSong.play();
}


let tracks = document.querySelectorAll(".card-title");

for (track of tracks){
    track.addEventListener("click", (event)=> {
    playTrack(`${event.target.innerText}.mp3`);
        songName.innerHTML =`<p class="play-song"> ${event.target.innerText}
                            <br>
                            <span class="play-artist">Arijit Singh</span></p>`;
        
        songPic.src = event.target.parentElement.firstElementChild.src;
        console.dir(event.target);
    })
    
}
    


async function playSong(){
    let songs = await getSongs();
    console.log(songs);
    var audio = new Audio(songs[0]);
    audio.play();

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (song of songs) {
        songUL.innerHTML += `<li> 
                                <i class="fa-solid fa-music"></i>
                                <div class="info">
                                    <p>${song.replaceAll("%20", "")}
                                    <p>Arijit Singh</p>
                                </div>
                                <div class="playnow">
                                    <span>play now</span>
                                    <i class="fa-solid fa-play"></i>
                                </div>
                             
                            </li>` ;
    }

    let li = document.querySelector(".songList").getElementsByTagName("li");
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=> {
        // console.log(e.querySelector(".info").firstElementChild.innerHTML);
        e.addEventListener("click", ()=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());


            let playlistSongName = e.querySelector(".info").firstElementChild.innerHTML.replaceAll(".mp3", "");
            songName.innerHTML =`<p class="play-song"> ${playlistSongName}
                                <br>
                                <span class="play-artist">Arijit Singh</span></p>`;
            songPic.src =`./Hm assets/${playlistSongName.trim()}.jpeg`;
        })
    })

    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play();
        } else{
            currentSong.pause();
        }
    })

    let circle = document.querySelector(".circle");

    currentSong.addEventListener("timeupdate", ()=> {
        document.querySelector(".tot-time").innerHTML = `${secToMin(currentSong.duration)}`;
        document.querySelector(".cur-time").innerHTML = `${secToMin(currentSong.currentTime)}`;
        circle.style.left = `${(currentSong.currentTime/currentSong.duration) * 100}%`

    })

    progress = document.querySelector(".seekbar");
    progress.addEventListener("click", (event)=> {
        // console.log(event.target.getBoundingClientRect());
        let percent = (event.offsetX/event.target.getBoundingClientRect().width) * 100;
        circle.style.left = percent + "%";
        currentSong.currentTime = Math.floor((currentSong.duration * percent)/100);
    })
}



function secToMin(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    return `0${minutes}:${Math.floor(remainingSeconds.toString().padStart(2, '0'))}`;
}

let playlist = document.querySelector(".playlist");
let songList = document.querySelector(".songList");
let playlistBtn = document.querySelector("#playlist-btn");


playlistBtn.addEventListener("click", ()=>{
    if (songList.id == "hidden"){
        songList.id = "";
        playlist.id = "hidden";
        playlistBtn.innerHTML = "back";
    } else if (playlist.id == "hidden"){
        playlist.id = "";
        songList.id = "hidden";
        playlistBtn.innerHTML = "liked songs";
    }
})

let creatBtn = document.querySelector("#creatlist");
creatBtn.addEventListener("click", ()=> {
    let input = document.createElement("input");
    input.classList.add("input");
    input.placeholder = "add playlist"
    creatBtn.insertAdjacentElement("afterend", input);

    playlistBox.addEventListener("click", (event)=> {
        let btn = document.createElement("button");
        if (event.target.nodeName == "INPUT"){
            btn.style.color = "black";
            btn.innerHTML = "add";
            btn.id = "addBtn";
            input.insertAdjacentElement("afterend", btn);
        } else if (event.target.id == "addBtn") {
            let newBtn = document.createElement("button");
            newBtn.innerText = input.value;
            newBtn.classList.add("badge");
            newBtn.style.marginLeft = "0.4rem"

            if (newBtn.innerText == ""){
                return NaN
            } else {
                document.querySelector("#playlist-btn").insertAdjacentElement("afterend", newBtn);
                input.remove();
                event.target.remove();
                input.value = "";
            }   
        }
    })
})





let album = document.querySelector(".album");
let loveBtn = document.querySelector(".love-album");
function changelikeButton(){
    album.addEventListener("dblclick", (event)=> {
    let likeBtn = document.createElement("img");
    if (event.target.id == "notLiked"){
        likeBtn.src = "./Hm assets/love-btn.png";
        likeBtn.id = "liked";
        likeBtn.classList.add("love-album");
        loveBtn.replaceWith(likeBtn);

        let li = document.createElement("li");
        li.innerHTML = `<i class="fa-solid fa-music"></i>
                <div class= "info">
                    <p>${songName.innerText.replaceAll("Arijit Singh", "").trim()}</p>
                    <p>Arijit Singh</p>
                </div>
                <div class="playnow">
                    <span>play now</span>
                    <i class="fa-solid fa-play"></i>
                </div>` ;
        li.classList.add("newli");
        li.id = `${songName.innerText.replaceAll("Arijit Singh", "").trim()}`;
        songList.appendChild(li);
        console.dir(li);
        } else if (event.target.id == "liked") {
            let parentUl = document.querySelector(".songList ul");
            document.getElementById(songName.innerText.replaceAll("Arijit Singh", "").trim()).remove();
            document.getElementById("liked").replaceWith(loveBtn);
        }
    })
    let cards = document.querySelectorAll(".card");
    for ( card of cards) {
        card.addEventListener("click", ()=>{;
        document.getElementById("liked").replaceWith(loveBtn);
        })
    }
}
changelikeButton();

function sidebarDisplay(){
    let forwardIcon = document.querySelector("#forward-icon");
    let sidebar = document.querySelector(".sidebar");
    let backIcon = document.querySelector("#back-icon");
    backIcon.addEventListener("click", ()=> {
        sidebar.style.display = "none";
    })
    forwardIcon.addEventListener("click", ()=> {
        sidebar.style.display = "inline-block";
    })
}
sidebarDisplay();
