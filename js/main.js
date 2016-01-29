// gulci's aside
// w JS każde wyrażenie coś zwraca, przypisanie zwraca undefined

(function () {

    var lastTime = 0;
    var vendors = ["ms", "moz", "webkit", "o"];

    //======================================================================

    $(window).load(function () {
        gamePlay.init(levelsPlay, loaderPlay);

        $("#playGameButton").click(function () {
            gamePlay.showLevelScreen();
        });
    });

    var game = {
        // deklaruję właściwości obiektu explicite, dla czytelności całości kodu
        // przy sprawdzeniu istnienia za pomocą if i bez tego dastalibyśmy undefined
        canvas: undefined,
        context: undefined,

        currentLevel: undefined,
        score: undefined,

        loaderInstance: undefined,
        levelsInstance: undefined,

        init: function (lev, load) {
            // używam wszędzie self, dzięki temu jestem odporny na zmianę nazwy zmiennej i używanie zawartości this w jQuery
            var self = this;
            loaderInstance = load;
            levelsInstance = lev;

            // przekazujemy obiekt game (self), żeby w obiekcie level nie mieć na twardo nazwy game
            loaderInstance.init();
            levelsInstance.init(self, loaderInstance);

            $(".gameLayer").hide();
            $("#gameStartScreen").show();

            // muszę wyciągnąć explicite pierwszy element z zapytania jQuery, bo inaczej nie uda się wywołać funkcji getContext()
            self.canvas = $("#gameCanvas")[0];
            self.context = self.canvas.getContext("2d");
        },

        showLevelScreen: function () {
            $(".gameLayer").hide();
            $("#levelSelectScreen").show("slow");
        },

        start: function () {
            console.log("Play the Game!");

            // tutaj uruchomimy pętlę animacji
        },

        animate: function () {
            // tutaj będziemy rysowali level
        }
    };

    // inicjalizacja w game.init()
    var levels = {
        gameInstance: undefined,
        loaderInstance: undefined,

        data: [
            // first level
            {
                foreground: "desert-foreground",
                background: "clouds-background",
                entities: [

                ]
            },
            // second level
            {
                foreground: "desert-foreground",
                background: "clouds-background",
                entities: [

                ]
            }
        ],
        // inicjalizacja ekranu z wyborem poziomu
        init: function (gameInst, loaderInst) {
            var self = this;
            gameInstance = gameInst;
            loaderInstance = loaderInst;

            var html = "";

            for (var i = 0; i < self.data.length; i++) {
                var level = self.data[i];
                // ewentualnie, można by zapisywać jako wartość indeksy tablicy, przy wywołaniu load() potrzebujemy właśnie indeks i musimy teraz robić odejmowanie w jQuery (-> listener)
                html += '<input type="button" value="' + (i + 1) + '">';
            }

            $("#levelSelectScreen").html(html);

            // używam this, dzięki temu jestem odporny na zmianę nazwy zmiennej
            $("#levelSelectScreen input").click(function () {
                // self odnosi się obiektu z poziomami (levels)
                // this to element ze zbioru wyników zapytania jQuery
                self.load(this.value - 1);
                $("#levelSelectScreen").hide();
            });

        },
        // ładuje dane i obrazy dla wybranego poziomu
        load: function (levelNumber) {
            var self = this;

            gameInstance.currentLevel = {
                backgroundImage: undefined,
                foregroundImage: undefined,
                slingshotImage: undefined,
                slingshotFrontImage: undefined,

                number: levelNumber,
                hero: [

                ]
            };
            gameInstance.score = 0;
            $("#score").html("Score: " + gameInstance.score);
            var level = self.data[levelNumber];

            gameInstance.currentLevel.backgroundImage = loaderInstance.loadImage("img/game/backgrounds/" + level.background + ".png");
            gameInstance.currentLevel.foregroundImage = loaderInstance.loadImage("img/game/backgrounds/" + level.foreground + ".png");
            gameInstance.currentLevel.slingshotImage = loaderInstance.loadImage("img/game/slingshot.png");
            gameInstance.currentLevel.slingshotFrontImage = loaderInstance.loadImage("img/game/slingshot-front.png");

            if (loaderInstance.loaded) {
                gameInstance.start();
            } else {
                // jak loader upora się z załadowaniem wszystkich obrazków, to w onload uruchomi nam się gra
                // dokladniej: w końcu po załadowaniu ostatniego obrazka warunek loaded w loaderze będzie spełniony i wtedy zostanie uruchomiona funkcja onload()
                loaderInstance.onload = game.start;
            }
        }
    };

    // inicjalizacja w game.init()
    var loader = {
        loaded: true,
        loadedCount: 0,
        totalCount: 0,

        // definicja explicite, tutaj będzie podstawiana funkcja
        onload: undefined,

        // tutaj sprawdzamy tylko wsparcie dla audio, z preferencją dla .ogg
        init: function () {
            var self = this;

            var mp3Support, oggSupport;
            // po wykonaniu init() ten element zostanie usunięty, nigdy nie zostanie dodany do DOM
            var audio = document.createElement("audio");

            if (audio.canPlayType) {
                mp3Support = ("" != audio.canPlayType("audio/mpeg"));
                oggSupport = ("" != audio.canPlayType('audio/ogg; codecs="vorbis"'));
            } else {
                mp3Support = false;
                oggSupport = false;
            }

            self.soundFileExtn = oggSupport?".ogg":mp3Support?".mp3":undefined;
        },

        loadImage: function(url) {
            var self = this;

            self.totalCount++;
            self.loaded = false;
            $("#loadingScreen").show();

            var image = new Image();

            // musimy podać funkcję, która uruchomi funkcję itemLoaded() na loaderze; jeśli bezpośrednio podamy do onload itemLoaded, to tam pod this będziemy mieli kolejne obrazki image - na nie będzie ustawiony scope
            image.onload = function () {
                self.itemLoaded();
            };

            image.src = url;

            return image;
        },

        // tutaj równie dobrze może być undefined, ponieważ w funkcji init() i tak sprawdzamy format, w ostateczności zostanie tam przypisane undefined; chyba, że chcemy mieć na początek coś domyślnego
        soundFileExtn: ".ogg",

        loadSound: function(url) {
            var self = this;

            self.totalCount++;
            self.loaded = false;
            $("#loadingScreen").show();

            var audio = new Audio();
            audio.src = url + self.soundFileExtn;
            audio.addEventListener("canplaythrough", self.itemLoaded, false);

            return audio;
        },

        itemLoaded: function () {
            var self = this;

            self.loadedCount++;
            $("#loadingMessage").html("Loaded " + self.loadedCount + " of " + self.totalCount);

            if (self.loadedCount == self.totalCount) {
                self.loaded = true;
                $("#loadingScreen").hide();

                // zawartość onload uruchamiamy, gdy wszystko będzie załadowane w obiekcie loader
                // tutaj to nie jest predefiniowane zdarzenie (jak chociażby w image), to zwykła właściwość obiektu, pod którą możemy podstawić funkcję i potem ją wykonać (taki pseudo-callback)
                if (self.onload) {
                    self.onload();
                    // po wykonaniu czyścimy, żeby ta funkcja nie załadowała się innym razem, gdy nie jest to konieczne
                    self.onload = undefined;
                }
            }
        }
    };

    // nazw game, levels i loader nie będę nigdzie używał, w razie czego zmiana chociażby nazwy będzie bezproblemowa
    // zabezpieczam się też na możliwość powoływania instancji gry, na razie mamy referencje, ale będzie można tworzyć nowe obiekty
    var gamePlay = game;
    var levelsPlay = levels;
    var loaderPlay = loader;

}());
