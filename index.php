<?php
function style($filename) {
  echo '<style>';
  include __DIR__ . "/" . $filename;
  echo '</style>';
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="stylesheet" href="./dist/index.css">
</head>
<body>
  <main class="uk-section uk-section-secondary uk-text-center">
    <div class="uk-child-width-1-3 uk-flex" uk-grid>
      <div>
        <button class="uk-button uk-button-default" id="btnFocusLess">Focus less</button>
      </div>
      <div>
        <progress-bar></progress-bar>
      </div>
      <div class="uk-text-center">
        <button class="uk-button uk-button-default" id="btnFocusMore">Focus more</button>
      </div>
    </div>
  </main>

  <script src="./dist/index.js"></script>
</body>
</html>
