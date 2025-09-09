const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

// Determine environment
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'js/[name].[contenthash].js',
    assetModuleFilename: 'assets/[name].[contenthash][ext]',
    publicPath: '/'
  },
  devtool: isProduction ? 'source-map' : 'inline-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'build'),
    },
    historyApiFallback: true, // For SPA routing
    compress: true,
    port: 3000,
    hot: true,
    open: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'autoprefixer'
                ]
              }
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[contenthash][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[contenthash][ext]'
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: isProduction ? {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        removeComments: false, // Keep comments to preserve template attribution
        // Preserve data attributes and IDs
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        removeEmptyAttributes: false, // Important for cookie elements
        removeRedundantAttributes: false
      } : false,
      scriptLoading: 'defer',
      inject: 'body'
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css'
    }),
    // Only copy static assets that are not processed by webpack
    new CopyWebpackPlugin({
      patterns: [
        // Copy all asset directories
        {
          from: 'src/assets',
          to: 'assets',
          noErrorOnMissing: true
        },
        // Copy favicon if exists
        {
          from: 'src/assets/favicon.ico',
          to: '',
          noErrorOnMissing: true
        },
        // Copy robots.txt
        {
          from: 'src/robots.txt',
          to: '',
          noErrorOnMissing: true
        },
        // Ensure pages directory is copied with correct structure
        {
          from: 'src/pages',
          to: 'pages',
          noErrorOnMissing: true
        }
      ]
    })
  ],
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
          compress: {
            drop_console: isProduction,
          },
        }
      }),
    ],
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  }
};

// Add a hook to validate the HTML for cookie banner
class CookieConsentValidationPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('CookieConsentValidationPlugin', compilation => {
      // Use the proper hook to access the HTML
      compilation.hooks.processAssets.tap(
        {
          name: 'CookieConsentValidationPlugin',
          stage: compilation.PROCESS_ASSETS_STAGE_OPTIMIZE
        },
        assets => {
          // Check if the index.html asset exists
          if (assets['index.html']) {
            const source = assets['index.html'].source();
            
            // Check if cookie elements exist
            if (!source.includes('cookieConsent')) {
              console.warn('\x1b[33m%s\x1b[0m', 'Warning: Cookie consent banner not found in HTML!');
            }
            
            if (!source.includes('cookieModal')) {
              console.warn('\x1b[33m%s\x1b[0m', 'Warning: Cookie settings modal not found in HTML!');
            }
            
            console.log('\x1b[32m%s\x1b[0m', 'Cookie consent validation completed.');
          }
        }
      );
    });
  }
}

// Add the validation plugin in development mode
if (!isProduction) {
  module.exports.plugins.push(new CookieConsentValidationPlugin());
}

// Add production-only plugins
if (isProduction) {
  module.exports.plugins.push(
    new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8
    })
  );
  
  // Add Brotli compression if needed
  module.exports.plugins.push(
    new CompressionPlugin({
      filename: '[path][base].br',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8
    })
  );
}
