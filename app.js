import { db } from './firebase-config.js';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const statusTray = document.getElementById('statusTray');
const storyModal = document.getElementById('storyModal');
const storyContent = document.getElementById('storyContent');
const progressBar = document.getElementById('progressBar');
const storyViews = document.getElementById('storyViews');
const closeBtn = document.getElementById('closeBtn');

// Fixed Profile Image URL from Google Drive
const PROFILE_IMAGE = "https://lh3.googleusercontent.com/d/1NzqmZp796ksKZrtpuMabgqpFXTGV3YIR";

let currentStories = [];
let storyTimer = null;
let progressInterval = null;

// Realtime Listener for Stories
const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {
    currentStories = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
    }));

    renderStatusTray();
});

function renderStatusTray() {
    if (!statusTray) return;
    statusTray.innerHTML = "";

    if (currentStories.length === 0) {
        statusTray.innerHTML = `<p class="no-status">No active stories</p>`;
        return;
    }

    currentStories.forEach((story, index) => {
        const item = document.createElement('div');
        item.className = 'status-item';
        
        // Dynamic Profile Image inside the Ring
        item.innerHTML = `
            <div class="avatar-ring">
                <div class="avatar-inner">
                    <img src="${PROFILE_IMAGE}" alt="${story.author}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">
                </div>
            </div>
            <p>${story.author || 'User'}</p>
        `;

        item.addEventListener('click', () => openStory(index));
        statusTray.appendChild(item);
    });
}

async function openStory(index) {
    const story = currentStories[index];
    if (!story) return;

    storyModal.classList.add('active');
    storyContent.innerHTML = "";
    
    // View count increment
    try {
        await updateDoc(doc(db, "stories", story.id), {
            views: increment(1)
        });
    } catch (e) {
        console.error("View count error:", e);
    }

    storyViews.innerText = `👁️ ${ (story.views || 0) + 1 } views`;

    // Render Content based on type
    if (story.type === 'text') {
        storyContent.style.backgroundColor = story.bgColor || "#0b0f19";
        storyContent.innerHTML = `<div class="story-text-display">${story.text}</div>`;
    } else if (story.type === 'image') {
        storyContent.style.backgroundColor = "#000";
        storyContent.innerHTML = `
            <div class="media-container">
                <img src="${story.mediaUrl}" alt="Story">
                ${story.text ? `<div class="caption">${story.text}</div>` : ''}
            </div>
        `;
    } else if (story.type === 'video') {
        storyContent.style.backgroundColor = "#000";
        storyContent.innerHTML = `
            <div class="media-container">
                <video src="${story.mediaUrl}" autoplay playsinline></video>
                ${story.text ? `<div class="caption">${story.text}</div>` : ''}
            </div>
        `;
    }

    startProgress(index);
}

function startProgress(currentIndex) {
    clearInterval(progressInterval);
    clearTimeout(storyTimer);

    let width = 0;
    progressBar.style.width = '0%';

    progressInterval = setInterval(() => {
        width += 2;
        progressBar.style.width = width + '%';
        if (width >= 100) {
            clearInterval(progressInterval);
        }
    }, 100); // 5 seconds total

    storyTimer = setTimeout(() => {
        if (currentIndex + 1 < currentStories.length) {
            openStory(currentIndex + 1);
        } else {
            closeStory();
        }
    }, 5000);
}

function closeStory() {
    storyModal.classList.remove('active');
    clearInterval(progressInterval);
    clearTimeout(storyTimer);
    progressBar.style.width = '0%';
}

if (closeBtn) {
    closeBtn.addEventListener('click', closeStory);
}
