(() => {
    const searchInput = document.querySelector('.search-bar');
    const searchbtn = document.querySelector('.search-btn');
    const videoCardContainer = document.querySelector(".video-container");
    const maxRes = document.querySelector('#video-count');
    const modal = document.getElementById('video-modal');
    let iframe = document.getElementById('video-iframe');
    const close = document.querySelector('.close');


    let api_key = "Enetr your own api key";
    let search_http = "https://www.googleapis.com/youtube/v3/search?";
    let duration_http = "https://www.googleapis.com/youtube/v3/videos?";
    let channel_http = 'https://www.googleapis.com/youtube/v3/channels?';

    //to open the most popular videos on open...not intrested

    // fetch(video_http + new URLSearchParams({
    //     key: api_key,
    //     part: 'snippet',
    //     chart: 'mostPopular',
    //     maxResults: 5,
    // }))
    //     .then(res => res.json())
    //     .then(data => {
    //         data.items.forEach(item => {
    //             getChannelIcon(item);
    //         });
    //     })
    //     .catch(err => console.log(err));

    let resultCount = maxRes.value;
    maxRes.addEventListener('click', e => {
        resultCount = maxRes.value;
    });


    //I want to search for my own content
    searchbtn.addEventListener('click', e => {
        e.preventDefault();
        videoCardContainer.innerHTML = "";
        fetch(search_http + new URLSearchParams({
            key: api_key,
            q: searchInput.value,
            chart: 'mostPopular',
            type: 'video',
            part: 'snippet',
            maxResults: resultCount
        }))
            .then(response => response.json())
            .then((data) => {
                data.items.forEach(item => {
                    getChannelIcon(item);
                })
            })
            .catch(err => console.log(err));
    });

    const getDuration = video_data => {
        return fetch(duration_http + new URLSearchParams({
            key: api_key,
            id: video_data.id.videoId,
            part: 'contentDetails'
        }))
            .then(res => res.json())
            .then(data => {
                const duration = data.items[0].contentDetails.duration;
                return duration;
            })
    };


    const getChannelIcon = video_data => {
        fetch(channel_http + new URLSearchParams({
            key: api_key,
            part: 'snippet',
            id: video_data.snippet.channelId
        }))
            .then(res => res.json())
            .then(data => {
                video_data.channelThumbnail = data.items[0].snippet.thumbnails.default.url;
                return getDuration(video_data);
            })
            .then(duration => {
                makeVideoCard(video_data, duration)
                console.log(duration);
            });
        console.log(video_data);
    };


    const makeVideoCard = (data, duration) => {
        const times = formatDuration(duration);
        const releaseDate = new Date(data.snippet.publishedAt);
        const formattedDate = `${releaseDate.toLocaleDateString()}`
        videoCardContainer.innerHTML += ` 
        <div class="video" id="videos" video-id = "${data.id.videoId}">
            <img src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt="">
            <div class="content">
                <img src="${data.channelThumbnail}" class="channel-icon" alt="">
                <div class="info">
                    <h4 class="title">${data.snippet.title}</h4>
                        <div>
                            <p class="channel-name">${data.snippet.channelTitle}</p>
                                <div class="datainfo">
                                    <p class="release">${formattedDate}</p>
                                    <p class="duration">${times}</p>
                                </div>
                        </div>
                </div>
            </div>
        </div>`
    };


    videoCardContainer.addEventListener("click", e => {
        let clicktoplay = e.target.closest(".video").getAttribute("video-id");
        if (clicktoplay) {
            openVideoModal(clicktoplay);
            console.log(`click was recorded on ${clicktoplay}`);
        }

    });

    const openVideoModal = (videoId) => {
        iframe.src = `https://www.youtube.com/embed/` + videoId;
        modal.style.display = "block";
        close.addEventListener('click', () => { closeVideoModal() });
    };

    const closeVideoModal = () => {
        iframe.src = "";
        modal.style.display = 'none';
    }

    //format the time
    function formatDuration(duration) {
        // Parse the duration string (in ISO 8601 format)
        const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

        const hours = match[1] ? parseInt(match[1], 10) : 0;
        const minutes = match[2] ? parseInt(match[2], 10) : 0;
        const seconds = match[3] ? parseInt(match[3], 10) : 0;

        // Format the duration as HH:MM:SS
        const formattedDuration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        return formattedDuration;
    }


    //this is because I made the search bar a div instead of a form, if made a form enter would work
    //didnt think form was the right tag for the job
    document.getElementById('search-bar').addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('search-btn').click();
        }
    });
})();