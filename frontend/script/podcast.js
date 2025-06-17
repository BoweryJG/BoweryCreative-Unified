// podcast.js - Dynamically loads podcast episodes from Supabase for podcast.html

document.addEventListener('DOMContentLoaded', function() {
    const supabaseUrl = 'https://cbopynuvhcymbumjnvay.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNib3B5bnV2aGN5bWJ1bWpudmF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5OTUxNzMsImV4cCI6MjA1OTU3MTE3M30.UZElMkoHugIt984RtYWyfrRuv2rB67opQdCrFVPCfzU';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    async function loadPodcasts() {
        const podcastCarousel = document.getElementById('podcastCarousel');
        if (!podcastCarousel) return;
        let { data: episodes, error } = await supabase
            .from('podcast_episodes')
            .select('*')
            .order('published_at', { ascending: false });
        if (error) {
            podcastCarousel.innerHTML = '<div class="error">Failed to load podcast episodes.</div>';
            return;
        }
        podcastCarousel.innerHTML = '';
        const gradients = [
            'linear-gradient(135deg, #1cade4 0%, #ff585d 100%)',
            'linear-gradient(135deg, #ff585d 0%, #ffd86d 100%)',
            'linear-gradient(135deg, #0a2342 0%, #1cade4 100%)',
            'linear-gradient(135deg, #ffd86d 0%, #ff585d 100%)',
            'linear-gradient(135deg, #21709e 0%, #1cade4 100%)',
        ];
        const now = new Date();
        episodes.forEach((ep, i) => {
            const card = document.createElement('article');
            card.className = 'podcast-story-card';
            card.style.background = gradients[i % gradients.length];
            // Avatar (host or fallback)
            const avatarSrc = ep.host_avatar || ep.image_url || 'img/podcast/default-podcast.jpg';
            // Badge if new (published in last 7 days)
            let badge = '';
            if (ep.published_at) {
                const pub = new Date(ep.published_at);
                const days = (now - pub) / (1000*60*60*24);
                if (days < 7) badge = '<div class="podcast-story-badge">New</div>';
            }
            // Quote or teaser
            const quote = ep.quote || ep.teaser || (ep.description ? ep.description.split('.').slice(0,1)[0] : '');
            // SVG waveform (static, could be animated)
            const waveform = `<svg class="podcast-story-waveform" viewBox="0 0 120 40" width="120" height="40"><g fill="#fff" opacity="0.9">${[8,16,32,24,40,24,32,16,8].map((h,x)=>`<rect x="${x*13}" y="${40-h}" width="8" height="${h}" rx="3"></rect>`).join('')}</g></svg>`;
            // Flip content (details + play)
            const flipContent = `<div class="podcast-story-flip-content">${ep.description || ''}<br><br><audio controls src="${ep.audio_url||''}" style="width:90%;margin-top:1rem;"></audio></div><button class="podcast-story-play">Play Episode</button>`;
            card.innerHTML = `
                ${badge}
                <img src="${avatarSrc}" alt="Host Avatar" class="podcast-story-avatar">
                <div class="podcast-story-title">${ep.title}</div>
                <div class="podcast-story-quote">“${quote}”</div>
                ${waveform}
                <div class="podcast-story-flip">
                  ${flipContent}
                </div>
            `;
            // Flip logic
            card.addEventListener('click', function(e) {
                if (card.classList.contains('flipped')) {
                  card.classList.remove('flipped');
                } else {
                  document.querySelectorAll('.podcast-story-card.flipped').forEach(c=>c.classList.remove('flipped'));
                  card.classList.add('flipped');
                }
            });
            podcastCarousel.appendChild(card);
        });
    }
    loadPodcasts();
});
