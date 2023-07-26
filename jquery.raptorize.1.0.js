(function ($) {
  $.fn.raptorize = function (options) {
    //Yo' defaults
    var defaults = {
      enterOn: "click", //timer, konami-code, click
      delayTime: 5000, //time before raptor attacks on timer mode
    };

    //Extend those options
    var options = $.extend(defaults, options);

    return this.each(function () {
      var _this = $(this);
      var audioSupported = false;
      //Stupid Browser Checking which should be in jQuery Support
      if (
        ($.browser.mozilla && $.browser.version.substr(0, 5) >= "1.9.2") ||
        $.browser.webkit
      ) {
        audioSupported = true;
      }

      //Dog Vars
      var dogImageMarkup =
        '<img id="elDog" style="display: none" src="dog.png" />';
      $("body").append(dogImageMarkup);
      var dog = $("#elDog").css({
        position: "fixed",
        bottom: "-700px",
        right: "0",
        left: "50px", // Adjust this value to move the dog further right
        display: "block",
        "z-index": 2, // make sure the dog is in front of the raptor
      });

      //Raptor Vars
      var raptorImageMarkup =
        '<img id="elRaptor" style="display: none" src="raptor.png" />';
      var raptorAudioMarkup =
        '<audio id="elRaptorShriek" preload="auto"><source src="raptor-sound.mp3" /><source src="raptor-sound.ogg" /></audio>';
      $("body").append(raptorImageMarkup);
      if (audioSupported) {
        $("body").append(raptorAudioMarkup);
      }
      var raptor = $("#elRaptor").css({
        position: "fixed",
        bottom: "-700px",
        right: "0",
        display: "block",
        "z-index": 1, // make sure the raptor is behind the dog
      });

      // Animating Code
      function init() {
        locked = true;

        //Sound Hilarity
        if (audioSupported) {
          function playSound() {
            document.getElementById("elRaptorShriek").play();
          }
          playSound();
        }

        // Movement Hilarity
        raptor.animate(
          {
            bottom: "0",
          },
          function () {
            $(this).animate(
              {
                bottom: "-130px",
              },
              100,
              function () {
                var offset = $(this).position().left + 400;
                $(this)
                  .delay(300)
                  .animate(
                    {
                      right: offset,
                    },
                    2200,
                    function () {
                      raptor = $("#elRaptor").css({
                        bottom: "-700px",
                        right: "0",
                      });
                      locked = false;
                    }
                  );
              }
            );
          }
        );

        // Dog Movement Hilarity
        dog.animate(
          {
            bottom: "0",
          },
          function () {
            $(this).animate(
              {
                bottom: "-130px",
              },
              100,
              function () {
                var offset = $(this).position().left + 400;
                $(this)
                  .delay(300)
                  .animate(
                    {
                      right: offset,
                    },
                    2200,
                    function () {
                      dog = $("#elDog").css({
                        bottom: "-700px",
                        right: "0",
                      });
                      locked = false;
                    }
                  );
              }
            );
          }
        );
      }

      //Determine Entrance
      if (options.enterOn == "timer") {
        setTimeout(init, options.delayTime);
      } else if (options.enterOn == "click") {
        _this.bind("click", function (e) {
          e.preventDefault();
          if (!locked) {
            init();
          }
        });
      } else if (options.enterOn == "konami-code") {
        var kkeys = [],
          konami = "38,38,40,40,37,39,37,39,66,65";
        $(window).bind(
          "keydown.raptorz",
          function (e) {
            kkeys.push(e.keyCode);
            if (kkeys.toString().indexOf(konami) >= 0) {
              init();
              $(window).unbind("keydown.raptorz");
            }
          },
          true
        );
      }
    }); //each call
  }; //orbit plugin call
})(jQuery);
