!pip install yfinance numpy pandas tensorflow scikit-learn
!pip install vadersentiment
!pip install praw nltk
!pip install asyncpraw
!pip install nest-asyncio
!pip install pandas_ta

import yfinance as yf
import numpy as np
import pandas as pd
import pandas_ta as ta
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, Input, Concatenate
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.models import Model
import asyncio
import nest_asyncio
from datetime import datetime, timedelta
import asyncpraw
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk

nest_asyncio.apply()

nltk.download('vader_lexicon')

class MarketSentimentAnalyzer:
    def __init__(self):
        self.sentiment_analyzer = SentimentIntensityAnalyzer()

        # Initialize Reddit API
        self.reddit = asyncpraw.Reddit(
            client_id='ZkADuhSW5DBblTHEeOMvRQ',
            client_secret='6yzHIGbX6yhR75af6DrJQanlxusuZQ',
            user_agent='script:StockPrediction:v1.0 (by /u/MundanePause7314)'
        )

        # Define relevant subreddits for different categories
        self.subreddits = {
            'market': ['wallstreetbets', 'stocks', 'investing', 'stockmarket', 'IndianStockMarket'],
            'economics': ['economics', 'economy', 'finance'],
            'news': ['worldnews', 'news', 'india', 'business'],
            'geopolitics': ['geopolitics', 'worldpolitics', 'IndiaSpeaks']
        }

        # Keywords to filter relevant posts
        self.market_keywords = [
            'market', 'stock', 'nifty', 'sensex', 'trading', 'nasdaq',
            'bull', 'bear', 'rally', 'crash', 'investment', 'economy',
            'inflation', 'interest rate', 'fed', 'rbi', 'gdp', 'recession'
        ]

    def is_relevant_post(self, title, body):
        """Check if post is relevant to market movements"""
        text = (title + ' ' + body).lower()
        return any(keyword in text for keyword in self.market_keywords)

    async def get_subreddit_sentiment(self, subreddit_name, days_back):
        """Get sentiment from a specific subreddit"""
        sentiments = []
        weights = []

        try:
            subreddit = await self.reddit.subreddit(subreddit_name)
            cutoff_time = datetime.utcnow() - timedelta(days=days_back)

            async for post in subreddit.new(limit=200):
                post_time = datetime.fromtimestamp(post.created_utc)

                if post_time < cutoff_time:
                    break

                # Check if post is relevant
                if not self.is_relevant_post(post.title, post.selftext):
                    continue

                # Calculate post sentiment
                title_sentiment = self.sentiment_analyzer.polarity_scores(post.title)
                body_sentiment = self.sentiment_analyzer.polarity_scores(post.selftext)

                # Weight calculation based on engagement
                weight = (post.score + post.num_comments) / 100

                # Weighted average of title and body sentiment
                post_sentiment = (title_sentiment['compound'] + body_sentiment['compound']) / 2

                sentiments.append(post_sentiment)
                weights.append(weight)

                await asyncio.sleep(0.1)

        except Exception as e:
            print(f"Error in {subreddit_name}: {str(e)}")

        if sentiments:

            return np.average(sentiments, weights=weights)
        return 0.0

    async def get_market_sentiment(self, days_back=7):
        """Get comprehensive market sentiment across all relevant subreddits"""
        all_sentiments = []

        for category, subreddits in self.subreddits.items():
            print(f"\nAnalyzing {category} subreddits...")

            for subreddit in subreddits:
                sentiment = await self.get_subreddit_sentiment(subreddit, days_back)
                if sentiment != 0.0:  # Only include if we got valid sentiment
                    all_sentiments.append({
                        'category': category,
                        'subreddit': subreddit,
                        'sentiment': sentiment
                    })
                print(f"Processed r/{subreddit}")

        # Convert to DataFrame for analysis
        df = pd.DataFrame(all_sentiments)
        if df.empty:
            return 0.0

        # Calculate weighted sentiment by category
        category_weights = {
            'market': 0.4,
            'economics': 0.3,
            'news': 0.2,
            'geopolitics': 0.1
        }

        final_sentiment = 0.0
        for category, weight in category_weights.items():
            category_sentiment = df[df['category'] == category]['sentiment'].mean()
            if not np.isnan(category_sentiment):
                final_sentiment += category_sentiment * weight

        return final_sentiment

class EnhancedMarketPredictor:
    def __init__(self, ticker, look_back=180):
        self.ticker = ticker
        self.look_back = look_back
        self.sentiment_analyzer = MarketSentimentAnalyzer()

    def add_technical_indicators(self, df):
        """Add technical indicators to the dataframe"""

        if isinstance(df.columns, pd.MultiIndex):
            df.columns = [col[0] if col[0] != col[1] else col[1] for col in df.columns]

        df.columns = [col.lower() for col in df.columns]

        # Calculate indicators one by one to ensure proper order
        try:
            # Trend Indicators
            df['SMA_20'] = ta.sma(df['close'], length=20)
            df['SMA_50'] = ta.sma(df['close'], length=50)
            df['EMA_20'] = ta.ema(df['close'], length=20)

            # Momentum Indicators
            df['RSI_14'] = ta.rsi(df['close'], length=14)
            macd = ta.macd(df['close'])
            df = pd.concat([df, macd], axis=1)

            stoch = ta.stoch(df['high'], df['low'], df['close'])
            df = pd.concat([df, stoch], axis=1)

            # Volatility Indicators
            bbands = ta.bbands(df['close'], length=20, std=2)
            df = pd.concat([df, bbands], axis=1)

            df['ATR_14'] = ta.atr(df['high'], df['low'], df['close'], length=14)

            # Volume Indicators
            df['OBV'] = ta.obv(df['close'], df['volume'])
            df['VWAP'] = ta.vwap(df['high'], df['low'], df['close'], df['volume'])

            # Wait for Bollinger Bands to be calculated before computing positions
            if 'BBL_20_2.0' in df.columns and 'BBU_20_2.0' in df.columns and 'BBM_20_2.0' in df.columns:
                df['bb_position'] = (df['close'] - df['BBL_20_2.0']) / (df['BBU_20_2.0'] - df['BBL_20_2.0'])
                df['bb_width'] = (df['BBU_20_2.0'] - df['BBL_20_2.0']) / df['BBM_20_2.0']
            else:
                print("Warning: Bollinger Bands not calculated properly")
                df['bb_position'] = 0
                df['bb_width'] = 0

            # SMA distances
            df['sma20_distance'] = ((df['close'] - df['SMA_20']) / df['close']) * 100
            df['sma50_distance'] = ((df['close'] - df['SMA_50']) / df['close']) * 100

        except Exception as e:
            print(f"Error calculating indicators: {str(e)}")
            print("Available columns:", df.columns.tolist())
            raise

        df.dropna(inplace=True)

        return df

    def fetch_and_prepare_data(self, start_date):
        """Fetch and prepare data with technical indicators"""
        df = yf.download(self.ticker, start=start_date)
        if df.empty:
            raise ValueError(f"No data found for {self.ticker}")

        df = self.add_technical_indicators(df)

        return df

    def preprocess_data(self, df, sentiment_score):
        """Preprocess market data with technical indicators and sentiment"""
        target = df['close'].values

        required_columns = [
            'open', 'high', 'low', 'close', 'volume',
            'RSI_14', 'MACD_12_26_9', 'STOCHk_14_3_3', 'STOCHd_14_3_3',
            'SMA_20', 'SMA_50', 'EMA_20',
            'bb_position', 'sma20_distance', 'sma50_distance', 'bb_width',
            'ATR_14', 'OBV', 'VWAP'
        ]

        for col in required_columns:
            if col not in df.columns:
                print(f"Warning: Missing column {col}, using zeros")
                df[col] = 0

        features = df[required_columns].values

        # Scale features
        self.feature_scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_features = self.feature_scaler.fit_transform(features)

        # Scale target
        self.target_scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_target = self.target_scaler.fit_transform(target.reshape(-1, 1))

        # Scale sentiment
        self.sentiment_scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_sentiment = self.sentiment_scaler.fit_transform([[sentiment_score]])

        return scaled_features, scaled_target, scaled_sentiment

    def prepare_sequences(self, features, target, sentiment):
        """Prepare sequences for LSTM"""
        X_technical, X_sentiment, y = [], [], []

        for i in range(self.look_back, len(features)):
            X_technical.append(features[i-self.look_back:i])
            X_sentiment.append(sentiment[0])
            y.append(target[i])

        return np.array(X_technical), np.array(X_sentiment), np.array(y)

    def build_enhanced_model(self, technical_shape):
        """Build enhanced model with technical indicators and sentiment"""
        technical_input = Input(shape=technical_shape)
        x = LSTM(128, return_sequences=True)(technical_input)
        x = Dropout(0.3)(x)
        x = LSTM(64, return_sequences=True)(x)
        x = Dropout(0.3)(x)
        x = LSTM(32, return_sequences=False)(x)
        x = Dropout(0.3)(x)

        sentiment_input = Input(shape=(1,))
        combined = Concatenate()([x, sentiment_input])

        x = Dense(64, activation='relu')(combined)
        x = Dense(32, activation='relu')(x)
        x = Dense(16, activation='relu')(x)
        output = Dense(1)(x)

        model = Model(inputs=[technical_input, sentiment_input], outputs=output)
        model.compile(optimizer='adam', loss='huber')

        return model

async def predict_today():
    ticker = "^NSEI"
    predictor = EnhancedMarketPredictor(ticker)

    try:
        # Get sentiment score
        print("Analyzing market sentiment...")
        sentiment_score = await predictor.sentiment_analyzer.get_market_sentiment(days_back=7)
        print(f"Current market sentiment: {sentiment_score:.4f}")

        # Fetch and prepare data
        start_date = (datetime.now() - timedelta(days=365)).strftime('%Y-%m-%d')
        df = predictor.fetch_and_prepare_data(start_date)

        # Print technical indicators for verification
        print("\nTechnical Indicators (latest values):")
        indicators = [
            'SMA_20', 'SMA_50', 'EMA_20', 'RSI_14',
            'MACD_12_26_9', 'STOCHk_14_3_3', 'STOCHd_14_3_3',
            'bb_position', 'bb_width', 'ATR_14',
            'OBV', 'VWAP', 'sma20_distance', 'sma50_distance'
        ]

        for indicator in indicators:
            if indicator in df.columns:
                print(f"{indicator}: {df[indicator].iloc[-1]:.2f}")
            else:
                print(f"{indicator}: Not calculated")

        # Preprocess data
        features, target, scaled_sentiment = predictor.preprocess_data(df, sentiment_score)

        # Prepare sequences
        X_technical, X_sentiment, y = predictor.prepare_sequences(
            features, target, scaled_sentiment
        )

        # Split data
        train_size = int(len(X_technical) * 0.8)
        X_tech_train = X_technical[:train_size]
        X_tech_test = X_technical[train_size:]
        X_sent_train = X_sentiment[:train_size]
        X_sent_test = X_sentiment[train_size:]
        y_train = y[:train_size]
        y_test = y[train_size:]

        # Build and train model
        model = predictor.build_enhanced_model(
            technical_shape=(X_tech_train.shape[1], X_tech_train.shape[2])
        )

        early_stop = EarlyStopping(monitor='val_loss', patience=15)

        history = model.fit(
            [X_tech_train, X_sent_train],
            y_train,
            batch_size=64,
            epochs=100,
            validation_data=([X_tech_test, X_sent_test], y_test),
            callbacks=[early_stop]
        )

        # Prepare prediction data
        last_sequence = features[-predictor.look_back:]
        last_sequence = np.expand_dims(last_sequence, axis=0)
        sentiment_input = np.array([[scaled_sentiment[0][0]]])

        # Make prediction
        predicted_scaled = model.predict([last_sequence, sentiment_input])
        predicted_price = predictor.target_scaler.inverse_transform(predicted_scaled)[0][0]

        print("\nPrediction Summary:")
        print(f"Previous Day's Close: {df['close'].iloc[-1]:.2f}")
        print(f"Predicted Close: {predicted_price:.2f}")
        print(f"Market Sentiment Score: {sentiment_score:.4f}")

        price_change = predicted_price - df['close'].iloc[-1]
        price_change_percent = (price_change / df['close'].iloc[-1]) * 100
        print(f"Predicted Change: {price_change:.2f} ({price_change_percent:.2f}%)")

        return predicted_price, sentiment_score, df

    except Exception as e:
        print(f"Error in prediction process: {str(e)}")
        raise

async def main():
    predicted_price, sentiment_score, technical_data = await predict_today()

# Run the analysis
await main()

