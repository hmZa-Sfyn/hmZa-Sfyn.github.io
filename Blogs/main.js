document.addEventListener('DOMContentLoaded', () => {
    fetchPosts();
    if (window.location.pathname.endsWith('readpost.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const postTitle = urlParams.get('title').replace(/_/g, ' ');
        fetchPostContent(postTitle);
    }
});

function fetchPosts() {
    fetch('../BlogPosts/posts.json')
        .then(response => response.json())
        .then(posts => {
            displayPosts(posts);
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
        });
}

function displayPosts(posts) {
    const latestPostsContainer = document.getElementById('latest-posts-container');
    const mostViewedPostsContainer = document.getElementById('most-viewed-posts-container');
    const mostPinnedStarredPostsContainer = document.getElementById('most-pinned-starred-posts-container');
    const allPostsContainer = document.getElementById('all-posts-container');

    // Display latest posts
    const latestPosts = posts.slice(-5).reverse();
    latestPosts.forEach(post => {
        const postCard = createPostCard(post);
        latestPostsContainer.appendChild(postCard);
    });

    // Display most viewed posts
    const mostViewedPosts = [...posts].sort((a, b) => b.views - a.views).slice(0, 3);
    mostViewedPosts.forEach(post => {
        const postCard = createPostCard(post, 'most-viewed');
        mostViewedPostsContainer.appendChild(postCard);
    });

    // Display most pinned and starred posts
    const mostPinnedStarredPosts = [...posts].sort((a, b) => (b.pins + b.stars) - (a.pins + a.stars)).slice(0, 3);
    mostPinnedStarredPosts.forEach(post => {
        const postCard = createPostCard(post, 'most-pinned-starred');
        mostPinnedStarredPostsContainer.appendChild(postCard);
    });

    // Display all posts
    posts.forEach(post => {
        const postCard = createPostCard(post);
        allPostsContainer.appendChild(postCard);
    });
}

function createPostCard(post, category = '') {
    const postCard = document.createElement('div');
    postCard.classList.add('card');
    if (category === 'most-viewed' || category === 'most-pinned-starred') {
        postCard.classList.add(category);
    }
    postCard.innerHTML = `
        <h3>${post.title}</h3>
        <p>Stars: ${post.stars} | Pins: ${post.pins} | Views: ${post.views}</p>
        <a href="readpost.html?title=${post.title.replace(/ /g, '_')}">Read more</a>
    `;
    return postCard;
}

function fetchPostContent(postTitle) {
    const postDir = `../BlogPosts/${postTitle.replace(/ /g, '_')}`;
    fetch(`${postDir}/${postTitle.replace(/ /g, '_')}.blog`)
        .then(response => response.text())
        .then(content => {
            document.getElementById('post-content').innerHTML = content;
            fetch(`${postDir}/SomeData.json`)
                .then(response => response.json())
                .then(data => {
                    document.getElementById('post-info').innerHTML = `
                        <p>Stars: ${data.stars}</p>
                        <p>Pins: ${data.pins}</p>
                        <p>Views: ${data.views}</p>
                    `;
                });
        })
        .catch(error => {
            console.error('Error fetching post content:', error);
        });
}
