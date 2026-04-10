TRUNCATE TABLE reviews, saved_listings, messages, listings, users RESTART IDENTITY CASCADE;

INSERT INTO users (username, email, password_hash, avatar_url, bio, is_verified)
VALUES
  ('alicegrowth', 'alice@flippearn.dev', '$2a$10$e9opAZcmLerHT2je/hEot.f2a1h6qjLonEUl2.V2yKZ5ME0EU4UTu', 'https://i.pravatar.cc/150?img=11', 'Growth marketer and creator.', TRUE),
  ('streamsam', 'sam@flippearn.dev', '$2a$10$e9opAZcmLerHT2je/hEot.f2a1h6qjLonEUl2.V2yKZ5ME0EU4UTu', 'https://i.pravatar.cc/150?img=12', 'Streamer and gaming niche seller.', TRUE),
  ('videovik', 'vik@flippearn.dev', '$2a$10$e9opAZcmLerHT2je/hEot.f2a1h6qjLonEUl2.V2yKZ5ME0EU4UTu', 'https://i.pravatar.cc/150?img=13', 'Video content strategist.', FALSE);

INSERT INTO listings
  (seller_id, title, description, platform, handle, followers_count, engagement_rate, price_usd, category, country, status, image_url)
VALUES
  (1, 'Instagram Fashion Niche', 'Highly engaged fashion audience with strong story views.', 'instagram', 'stylewithalice', 120000, 4.80, 4800, 'Fashion', 'United States', 'active', ''),
  (1, 'YouTube Tech Reviews Channel', 'Monetized channel with evergreen tech content.', 'youtube', 'techbytevik', 56000, 5.20, 7200, 'Technology', 'India', 'active', ''),
  (2, 'Twitch Gaming Stream Account', 'FPS gaming community and recurring subs.', 'twitch', 'samsquadlive', 23000, 6.10, 3500, 'Gaming', 'Canada', 'active', ''),
  (2, 'Twitter Crypto Updates Page', 'Daily market updates and active comments.', 'twitter', 'cryptopulsehq', 82000, 3.90, 4100, 'Finance', 'United Kingdom', 'active', ''),
  (3, 'Telegram Trading Signals Group', 'Premium-ready signal audience, high retention.', 'telegram', 'alpha_signals_vip', 14500, 9.40, 3000, 'Finance', 'UAE', 'active', ''),
  (3, 'TikTok Fitness Shorts Profile', 'Short-form gym motivation and workout clips.', 'tiktok', 'fitformdaily', 98000, 8.20, 5300, 'Fitness', 'Australia', 'active', ''),
  (1, 'Instagram Food Blog Account', 'Recipe reels with excellent saves and shares.', 'instagram', 'tastytrailz', 67000, 7.20, 3900, 'Food', 'Italy', 'active', ''),
  (2, 'YouTube Study Tips Channel', 'Student-focused content with strong watch time.', 'youtube', 'studyboosthub', 41000, 5.80, 2800, 'Education', 'Singapore', 'active', ''),
  (3, 'Twitter Startup Meme Page', 'Founder humor content with viral potential.', 'twitter', 'buildinpubliclol', 35000, 4.10, 1900, 'Business', 'Germany', 'active', ''),
  (1, 'Other Platform Community Page', 'Niche community page with stable growth trend.', 'other', 'nichecommunityx', 21000, 5.00, 1500, 'Community', 'Brazil', 'active', '');
