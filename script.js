const videoList = document.getElementById('video-list');
const searchBar = document.getElementById('search-bar');

async function fetchVideos() {                // Fetch videos from the API
  try {
    const response = await fetch('https://api.freeapi.app/api/v1/public/youtube/videos');
    const data = await response.json();
    
    if (data.statusCode === 200) {
      const videos = data.data.data;         // Accessing data
      displayVideos(videos);
      setupSearch(videos);
    } else {
      throw new Error('Failed to fetch videos');
    }
  } catch (error) {
    console.error('Error fetching videos:', error);
    videoList.innerHTML = '<p>Failed to load videos. Please try again later.</p>';
  }
}

function displayVideos(videos) {                   // Display videos in a grid layout
  if (!Array.isArray(videos)) {
    console.error('Expected videos to be an array, but got:', videos);
    return;
  }

  videoList.innerHTML = videos
    .map(
      (video) => `
      <div class="video-card" onclick="openVideo('${video.items.id}')">
        <img src="${video.items.snippet.thumbnails.medium.url}" alt="${video.items.snippet.title}" class="video-thumbnail" />
        <div class="video-info">
          <p class="video-title">${video.items.snippet.title}</p>
          <p class="video-channel">${video.items.snippet.channelTitle}</p>
        </div>
      </div>
    `
    )
    .join('');
}

function openVideo(videoId) {                // Open video in YouTube
  window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
}
 
function setupSearch(videos) {                               // Setup search functionality
  searchBar.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredVideos = videos.filter(
      (video) =>
        video.items.snippet.title.toLowerCase().includes(searchTerm) ||
        video.items.snippet.channelTitle.toLowerCase().includes(searchTerm)
    );
    displayVideos(filteredVideos);
  });
}

fetchVideos();