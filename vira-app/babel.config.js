module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // Bu satır artık router'ı da içeriyor
    plugins: [

      'react-native-reanimated/plugin', 
    ],
  };
};