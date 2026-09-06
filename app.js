import { db } from './firebase-config.js';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const statusTray = document.getElementById('statusTray');
const storyModal = document.getElementById('storyModal');
const storyContent = document.getElementById('storyContent');
const closeModal = document.getElementById('closeModal');
const progressBar = document.getElementById('progressBar');

let storyTimer = null;

const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {
    statusTray.innerHTML = "";

    if(snapshot.empty) {
        statusTray.innerHTML = `<p class="no-status">No active status available</p>`;
        return;
    }

    snapshot.docs.forEach(docSnap => {
        const story = docSnap.data();
        const storyId = docSnap.id;

        const item = document.createElement('div');
        item.className = 'status-item';
        item.innerHTML = `
            <div class="avatar-ring">
                <div class="avatar-inner">${story.author.charAt(0).toUpperCase()}</div>
            </div>
            <p>${story.author}</p>
        `;
        
        item.addEventListener('click', () => openStory(story, storyId));
        statusTray.appendChild(item);
    });
});

async function openStory(story, storyId) {
    storyContent.innerHTML = "";
    
    try {
        const storyRef = doc(db, "stories", storyId);
        await updateDoc(storyRef, { views: increment(1) });
    } catch (e) {
        console.log("View update issue:", e);
    }

    if (story.type === 'text') {
        storyContent.style.backgroundColor = story.bgColor || "#075e54";
        storyContent.innerHTML = `
            <div class="story-text-display">${story.text}</div>
            <div class="story-views">👁️ ${ (story.views || 0) + 1 } views</div>
        `;
    } else {
        storyContent.style.backgroundColor = "#000";
        if (story.type === 'image') {
            storyContent.innerHTML = `
                <div class="media-container">
                    <img src="${story.mediaUrl}" />
                    ${story.text ? `<p class="caption">${story.text}</p>` : ''}
                    <div class="story-views">👁️ ${ (story.views || 0) + 1 } views</div>
                </div>`;
        } else if (story.type === 'video') {
            storyContent.innerHTML = `
                <div class="media-container">
                    <video src="${story.mediaUrl}" autoplay muted playsinline></video>
                    ${story.text ? `<p class="caption">${story.text}</p>` : ''}
                    <div class="story-views">👁️ ${ (story.views || 0) + 1 } views</div>
                </div>`;
        }
    }
    
    storyModal.classList.add('active');
    startProgressBar(6000);
}

function startProgressBar(duration) {
    clearTimeout(storyTimer);
    progressBar.style.width = "0%";
    
    setTimeout(() => {
        progressBar.style.transition = `width ${duration}ms linear`;
        progressBar.style.width = "100%";
    }, 50);

    storyTimer = setTimeout(() => {
        closeStoryModal();
    }, duration);
}

function closeStoryModal() {
    storyModal.classList.remove('active');
    progressBar.style.transition = "none";
    progressBar.style.width = "0%";
    clearTimeout(storyTimer);
}

closeModal.addEventListener('click', closeStoryModal);
