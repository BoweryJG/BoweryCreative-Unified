// blog.js - Dynamically loads blog posts from Supabase for blog.html

document.addEventListener('DOMContentLoaded', function() {
    const supabaseUrl = 'https://cbopynuvhcymbumjnvay.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNib3B5bnV2aGN5bWJ1bWpudmF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5OTUxNzMsImV4cCI6MjA1OTU3MTE3M30.UZElMkoHugIt984RtYWyfrRuv2rB67opQdCrFVPCfzU';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    async function loadBlogPosts() {
        const blogGrid = document.getElementById('blogGrid');
        if (!blogGrid) return;
        let { data: posts, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('published_at', { ascending: false });
        if (error) {
            blogGrid.innerHTML = '<div class="error">Failed to load blog posts.</div>';
            return;
        }
        blogGrid.innerHTML = '';
        posts.forEach(post => {
            const card = document.createElement('article');
            card.className = 'blog-card fade-in';
            card.setAttribute('data-tags', post.tags || '');
            const bodyPreview = post.body ? post.body.substring(0, 120) + (post.body.length > 120 ? '...' : '') : '';
            const tagsMarkup = post.tags ? `<span class="blog-tags">${post.tags}</span>` : '';
            const date = post.published_at ? new Date(post.published_at).toLocaleDateString() : '';
            const imgSrc = post.image_url ? post.image_url : 'img/blog/default-blog.jpg';
            card.innerHTML = `
                <img src="${imgSrc}" alt="${post.title}" class="blog-img">
                <div class="blog-content">
                    <h3>${post.title}</h3>
                    <p>${bodyPreview}</p>
                    ${tagsMarkup}
                    <div class="blog-meta">${date}</div>
                    <a href="#" class="btn btn-tertiary blog-detail-btn" data-id="${post.id}">Read More</a>
                </div>`;
            blogGrid.appendChild(card);
        });
    }
    loadBlogPosts();
});
