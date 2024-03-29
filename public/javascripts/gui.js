/*

 gui.js

 a programming environment
 based on morphic.js, blocks.js, threads.js and objects.js
 inspired by Scratch

 written by Jens Mönig
 jens@moenig.org

 Copyright (C) 2014 by Jens Mönig

 This file is part of Snap!.

 Snap! is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.


 prerequisites:
 --------------
 needs blocks.js, threads.js, objects.js and morphic.js


 toc
 ---
 the following list shows the order in which all constructors are
 defined. Use this list to locate code in this document:

 IDE_Morph
 ProjectDialogMorph
 SpriteIconMorph
 TurtleIconMorph
 CostumeIconMorph
 WardrobeMorph


 credits
 -------
 Nathan Dinsmore contributed saving and loading of projects,
 ypr-Snap! project conversion and countless bugfixes
 Ian Reynolds contributed handling and visualization of sounds

 */

/*global modules, Morph, SpriteMorph, BoxMorph, SyntaxElementMorph, Color,
 ListWatcherMorph, isString, TextMorph, newCanvas, useBlurredShadows,
 radians, VariableFrame, StringMorph, Point, SliderMorph, MenuMorph,
 morphicVersion, DialogBoxMorph, ToggleButtonMorph, contains,
 ScrollFrameMorph, StageMorph, PushButtonMorph, InputFieldMorph, FrameMorph,
 Process, nop, SnapSerializer, ListMorph, detect, AlignmentMorph, TabMorph,
 Costume, CostumeEditorMorph, MorphicPreferences, touchScreenSettings,
 standardSettings, Sound, BlockMorph, ToggleMorph, InputSlotDialogMorph,
 ScriptsMorph, isNil, SymbolMorph, BlockExportDialogMorph,
 BlockImportDialogMorph, SnapTranslator, localize, List, InputSlotMorph,
 SnapCloud, Uint8Array, HandleMorph, SVG_Costume, fontHeight, hex_sha512,
 sb, CommentMorph, CommandBlockMorph, BlockLabelPlaceHolderMorph, Audio,
 SpeechBubbleMorph*/

// Global stuff ////////////////////////////////////////////////////////

modules.gui = '2014-July-30';


// Declarations

var IDE_Morph;
var ProjectDialogMorph;
var SpriteIconMorph;
var CostumeIconMorph;
var TurtleIconMorph;
var WardrobeMorph;
var SoundIconMorph;
var JukeboxMorph;

var ScriptIconMorph;
var ShareBoxScriptsMorph;
var ShareBoxAssetsMorph;
var tag1people;
var tag1animal;
var tag1object;
var tag2singapore;
var tag2other;
var tag2china;
var tag2india;
var tag2japan;
var tag1bool;

var currentPage;
var maxPage;
var refreshPage;

// IDE_Morph ///////////////////////////////////////////////////////////

// I am SNAP's top-level frame, the Editor window
// IDE_Morph inherits from Morph:

IDE_Morph.prototype = new Morph();
IDE_Morph.prototype.constructor = IDE_Morph;
IDE_Morph.uber = Morph.prototype;
IDE_Morph.className = 'IDE_Morph';

// IDE_Morph preferences settings and skins

IDE_Morph.prototype.setDefaultDesign = function () {
    MorphicPreferences.isFlat = false;
    SpriteMorph.prototype.paletteColor = new Color(55, 55, 55);
    SpriteMorph.prototype.paletteTextColor = new Color(230, 230, 230);
    StageMorph.prototype.paletteTextColor
        = SpriteMorph.prototype.paletteTextColor;
    StageMorph.prototype.paletteColor = SpriteMorph.prototype.paletteColor;
    SpriteMorph.prototype.sliderColor
        = SpriteMorph.prototype.paletteColor.lighter(30);

    IDE_Morph.prototype.buttonContrast = 30;
    IDE_Morph.prototype.backgroundColor = new Color(40, 40, 40);
    IDE_Morph.prototype.frameColor = SpriteMorph.prototype.paletteColor;

    IDE_Morph.prototype.groupColor
        = SpriteMorph.prototype.paletteColor.lighter(8);
    IDE_Morph.prototype.sliderColor = SpriteMorph.prototype.sliderColor;
    IDE_Morph.prototype.buttonLabelColor = new Color(255, 255, 255);
    IDE_Morph.prototype.tabColors = [
        IDE_Morph.prototype.groupColor.darker(40),
        IDE_Morph.prototype.groupColor.darker(60),
        IDE_Morph.prototype.groupColor
    ];
    IDE_Morph.prototype.rotationStyleColors = IDE_Morph.prototype.tabColors;
    IDE_Morph.prototype.appModeColor = new Color();
    IDE_Morph.prototype.scriptsPaneTexture = 'scriptsPaneTexture.gif';
    IDE_Morph.prototype.padding = 5;

    SpriteIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
    CostumeIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
    SoundIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
    TurtleIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
};

IDE_Morph.prototype.setFlatDesign = function () {
    MorphicPreferences.isFlat = true;

    SpriteMorph.prototype.paletteColor = new Color(255, 255, 255);
    SpriteMorph.prototype.paletteTextColor = new Color(70, 70, 70);
    StageMorph.prototype.paletteTextColor
        = SpriteMorph.prototype.paletteTextColor;
    StageMorph.prototype.paletteColor = SpriteMorph.prototype.paletteColor;
    SpriteMorph.prototype.sliderColor = SpriteMorph.prototype.paletteColor;

    IDE_Morph.prototype.buttonContrast = 30;
    IDE_Morph.prototype.backgroundColor = new Color(200, 200, 200);
    IDE_Morph.prototype.frameColor = new Color(255, 255, 255);

    IDE_Morph.prototype.groupColor = new Color(230, 230, 230);
    IDE_Morph.prototype.sliderColor = SpriteMorph.prototype.sliderColor;
    IDE_Morph.prototype.buttonLabelColor = new Color(70, 70, 70);
    IDE_Morph.prototype.tabColors = [
        IDE_Morph.prototype.groupColor.lighter(60),
        IDE_Morph.prototype.groupColor.darker(10),
        IDE_Morph.prototype.groupColor
    ];
    IDE_Morph.prototype.rotationStyleColors = [
        IDE_Morph.prototype.groupColor,
        IDE_Morph.prototype.groupColor.darker(10),
        IDE_Morph.prototype.groupColor.darker(30)
    ];
    IDE_Morph.prototype.appModeColor = IDE_Morph.prototype.frameColor;
    IDE_Morph.prototype.scriptsPaneTexture = null;
    IDE_Morph.prototype.padding = 1;

    SpriteIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
    CostumeIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
    SoundIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
    TurtleIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
};

IDE_Morph.prototype.setFlatDesign();

// IDE_Morph instance creation:

function IDE_Morph(isAutoFill) {
    this.init(isAutoFill);
}

IDE_Morph.prototype.init = function (isAutoFill) {
    // global font setting
    MorphicPreferences.globalFontFamily = 'Helvetica, Arial';

    // restore saved user preferences
    this.userLanguage = null; // user language preference for startup
    this.applySavedSettings();
    IDE_Morph.prototype.setFlatDesign(); // flat design

    // additional properties:
    this.cloudMsg = null;
    this.source = 'local';
    this.serializer = new SnapSerializer();

    this.globalVariables = new VariableFrame();
    this.currentSprite = new SpriteMorph(this.globalVariables);
    this.shareBoxPlaceholderSprite = new SpriteMorph(this.globalVariables);
    this.shareBoxPlaceholderSprite.scriptsList = new List();
    this.sprites = new List([this.currentSprite]);
    this.currentCategory = 'motion';
    this.currentTab = 'scripts';
    this.currentShareBoxTab = 'scripts';
    this.currentShareBoxConnectTab = 'connect';
    this.projectName = '';
    this.projectNotes = '';
    this.sharer = IDE_Morph.makeSocket.call(this, this, '42');
    this.shareboxId = 'No Group Yet';

    this.logo = null;
    this.controlBar = null;
    this.categories = null;
    this.palette = null;
    this.spriteBar = null;
    this.spriteEditor = null;
    this.stage = null;
    this.corralBar = null;
    this.corral = null;
    this.shareBoxBar = null;
    this.shareBox = null;
    this.shareAssetsBox = null;
    this.shareBoxTitleBar = null;
    this.shareBoxConnectBar = null;
    this.shareBoxConnect = null;

    this.isAutoFill = isAutoFill || true;
    this.isAppMode = false;
    this.isSmallStage = false;
    this.filePicker = null;
    this.hasChangedMedia = false;

    this.isAnimating = true;
    this.stageRatio = 1; // for IDE animations, e.g. when zooming

    this.loadNewProject = false; // flag when starting up translated
    this.shield = null;

    // initialize inherited properties:
    IDE_Morph.uber.init.call(this);

    // override inherited properites:
    this.color = this.backgroundColor;
	
	this.currentPage = 1;
	this.refreshPage = 0;
	
	this.openLibrary();
	//this.library.destroy();
};

IDE_Morph.prototype.openIn = function (world) {
    var hash, usr, myself = this, urlLanguage = null;

    this.buildPanes();
    world.add(this);
    world.userMenu = this.userMenu;

    // get persistent user data, if any
    if (localStorage) {
        usr = localStorage['-snap-user'];
        if (usr) {
            usr = SnapCloud.parseResponse(usr)[0];
            if (usr) {
                SnapCloud.username = usr.username || null;
                SnapCloud.password = usr.password || null;
            }
        }
    }

    // override SnapCloud's user message with Morphic
    SnapCloud.message = function (string) {
        var m = new MenuMorph(null, string),
            intervalHandle;
        m.popUpCenteredInWorld(world);
        intervalHandle = setInterval(function () {
            m.destroy();
            clearInterval(intervalHandle);
        }, 2000);
    };

    // prevent non-DialogBoxMorphs from being dropped
    // onto the World in user-mode
    world.reactToDropOf = function (morph) {
        if (!(morph instanceof DialogBoxMorph)) {
            if (world.hand.grabOrigin) {
                morph.slideBackTo(world.hand.grabOrigin);
            } else {
                world.hand.grab(morph);
            }
        }
    };

    this.reactToWorldResize(world.bounds);

    function getURL(url) {
        try {
            var request = new XMLHttpRequest();
            request.open('GET', url, false);
            request.send();
            if (request.status === 200) {
                return request.responseText;
            }
            throw new Error('unable to retrieve ' + url);
        } catch (err) {
            return;
        }
    }

    // dynamic notifications from non-source text files
    // has some issues, commented out for now
    /*
     this.cloudMsg = getURL('http://snap.berkeley.edu/cloudmsg.txt');
     motd = getURL('http://snap.berkeley.edu/motd.txt');
     if (motd) {
     this.inform('Snap!', motd);
     }
     */

    function interpretUrlAnchors() {
        var dict;
        if (location.hash.substr(0, 6) === '#open:') {
            hash = location.hash.substr(6);
            if (hash.charAt(0) === '%'
                || hash.search(/\%(?:[0-9a-f]{2})/i) > -1) {
                hash = decodeURIComponent(hash);
            }
            if (contains(
                ['project', 'blocks', 'sprites', 'snapdata'].map(
                    function (each) {
                        return hash.substr(0, 8).indexOf(each);
                    }
                ),
                1
            )) {
                this.droppedText(hash);
            } else {
                this.droppedText(getURL(hash));
            }
        } else if (location.hash.substr(0, 5) === '#run:') {
            hash = location.hash.substr(5);
            if (hash.charAt(0) === '%'
                || hash.search(/\%(?:[0-9a-f]{2})/i) > -1) {
                hash = decodeURIComponent(hash);
            }
            if (hash.substr(0, 8) === '<project>') {
                this.rawOpenProjectString(hash);
            } else {
                this.rawOpenProjectString(getURL(hash));
            }
            this.toggleAppMode(true);
            this.runScripts();
        } else if (location.hash.substr(0, 9) === '#present:') {
            this.shield = new Morph();
            this.shield.color = this.color;
            this.shield.setExtent(this.parent.extent());
            this.parent.add(this.shield);
            myself.showMessage('Fetching project\nfrom the cloud...');

            // make sure to lowercase the username
            dict = SnapCloud.parseDict(location.hash.substr(9));
            dict.Username = dict.Username.toLowerCase();

            SnapCloud.getPublicProject(
                SnapCloud.encodeDict(dict),
                function (projectData) {
                    var msg;
                    myself.nextSteps([
                        function () {
                            msg = myself.showMessage('Opening project...');
                        },
                        function () {
                            if (projectData.indexOf('<snapdata') === 0) {
                                myself.rawOpenCloudDataString(projectData);
                            } else if (
                                projectData.indexOf('<project') === 0
                                ) {
                                myself.rawOpenProjectString(projectData);
                            }
                            myself.hasChangedMedia = true;
                        },
                        function () {
                            myself.shield.destroy();
                            myself.shield = null;
                            msg.destroy();
                            myself.toggleAppMode(true);
                            myself.runScripts();
                        }
                    ]);
                },
                this.cloudError()
            );
        } else if (location.hash.substr(0, 6) === '#lang:') {
            urlLanguage = location.hash.substr(6);
            this.setLanguage(urlLanguage);
            this.loadNewProject = true;
        } else if (location.hash.substr(0, 7) === '#signup') {
            this.createCloudAccount();
        }
    }

    if (this.userLanguage) {
        this.setLanguage(this.userLanguage, interpretUrlAnchors);
    } else {
        interpretUrlAnchors.call(this);
    }
};

// IDE_Morph construction

IDE_Morph.prototype.buildPanes = function () {
    this.createLogo();
    this.createControlBar();
    this.createCategories();
    this.createPalette();
    this.createStage();
    this.createSpriteBar();
    this.createSpriteEditor();
    this.createCorralBar();
    this.createCorral();
    this.createShareBoxTitleBar();
    this.createShareBoxBar();
    this.createShareBox();
    this.createShareAssetsBox();
    this.createShareBoxConnectBar();
    this.createShareBoxConnect();
    this.showNewGroupScreen();
};

IDE_Morph.prototype.createLogo = function () {
    var myself = this;

    if (this.logo) {
        this.logo.destroy();
    }

    this.logo = new Morph();
    this.logo.texture = 'images/cc_logo.png'; // xinni: new logo
    this.logo.drawNew = function () {
        this.image = newCanvas(this.extent());
        var context = this.image.getContext('2d'),
            gradient = context.createLinearGradient(
                0,
                0,
                this.width(),
                0
            );
        //gradient.addColorStop(0, 'grey');
        //gradient.addColorStop(0.5, myself.frameColor.toString());
        context.fillStyle = MorphicPreferences.isFlat ?
            myself.frameColor.toString() : gradient;
        context.fillRect(0, 0, this.width(), this.height());
        if (this.texture) {
            this.drawTexture(this.texture);
        }
    };

    this.logo.drawCachedTexture = function () {
        var context = this.image.getContext('2d');
        context.drawImage(
            this.cachedTexture,
            5,
            Math.round((this.height() - this.cachedTexture.height) / 2)
        );
        this.changed();
    };

    this.logo.mouseClickLeft = function () {
        myself.snapMenu();
    };

    this.logo.color = new Color();
    this.logo.setExtent(new Point(200, 28)); // xinni: edited dimensions of the logo
    this.add(this.logo);
};

IDE_Morph.prototype.createControlBar = function () {
    // assumes the logo has already been created
    var padding = 5,
        button,
        stopButton,
        pauseButton,
        startButton,
        projectButton,
        settingsButton,
        stageSizeButton,
        appModeButton,
        cloudButton,
        x,
        colors = [
            this.groupColor.darker(3),
            this.frameColor.darker(40),
            this.frameColor.darker(40)
        ],
        myself = this;

    if (this.controlBar) {
        this.controlBar.destroy();
    }

    this.controlBar = new Morph();
    this.controlBar.color = this.frameColor;
    this.controlBar.setHeight(this.logo.height()); // height is fixed
    this.controlBar.mouseClickLeft = function () {
        this.world().fillPage();
    };
    this.add(this.controlBar);

    //smallStageButton
    button = new ToggleButtonMorph(
        null, //colors,
        myself, // the IDE is the target
        'toggleStageSize',
        [
            new SymbolMorph('smallStage', 14),
            new SymbolMorph('normalStage', 14)
        ],
        function () {  // query
            return myself.isSmallStage;
        }
    );

    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    button.drawNew();
    // button.hint = 'stage size\nsmall & normal';
    button.fixLayout();
    button.refresh();
    stageSizeButton = button;
    this.controlBar.add(stageSizeButton);
    this.controlBar.stageSizeButton = button; // for refreshing

    //appModeButton
    button = new ToggleButtonMorph(
        null, //colors,
        myself, // the IDE is the target
        'toggleAppMode',
        [
            new SymbolMorph('fullScreen', 14),
            new SymbolMorph('normalScreen', 14)
        ],
        function () {  // query
            return myself.isAppMode;
        }
    );

    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    button.drawNew();
    // button.hint = 'app & edit\nmodes';
    button.fixLayout();
    button.refresh();
    appModeButton = button;
    this.controlBar.add(appModeButton);
    this.controlBar.appModeButton = appModeButton; // for refreshing

    // stopButton
    button = new PushButtonMorph(
        this,
        'stopAllScripts',
        new SymbolMorph('octagon', 14)
    );
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = new Color(200, 0, 0);
    button.contrast = this.buttonContrast;
    button.drawNew();
    // button.hint = 'stop\nevery-\nthing';
    button.fixLayout();
    stopButton = button;
    this.controlBar.add(stopButton);

    //pauseButton
    button = new ToggleButtonMorph(
        null, //colors,
        myself, // the IDE is the target
        'togglePauseResume',
        [
            new SymbolMorph('pause', 12),
            new SymbolMorph('pointRight', 14)
        ],
        function () {  // query
            return myself.isPaused();
        }
    );

    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = new Color(255, 220, 0);
    button.contrast = this.buttonContrast;
    button.drawNew();
    // button.hint = 'pause/resume\nall scripts';
    button.fixLayout();
    button.refresh();
    pauseButton = button;
    this.controlBar.add(pauseButton);
    this.controlBar.pauseButton = pauseButton; // for refreshing

    // startButton
    button = new PushButtonMorph(
        this,
        'pressStart',
        new SymbolMorph('flag', 14)
    );
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = new Color(0, 200, 0);
    button.contrast = this.buttonContrast;
    button.drawNew();
    // button.hint = 'start green\nflag scripts';
    button.fixLayout();
    startButton = button;
    this.controlBar.add(startButton);
    this.controlBar.startButton = startButton;

    // projectButton
    button = new PushButtonMorph(
        this,
        'projectMenu',
        new SymbolMorph('file', 14)
        //'\u270E'
    );
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    button.drawNew();
    // button.hint = 'open, save, & annotate project';
    button.fixLayout();
    projectButton = button;
    this.controlBar.add(projectButton);
    this.controlBar.projectButton = projectButton; // for menu positioning

    // settingsButton
    button = new PushButtonMorph(
        this,
        'settingsMenu',
        new SymbolMorph('gears', 14)
        //'\u2699'
    );
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    button.drawNew();
    button.fixLayout();
    settingsButton = button;
    this.controlBar.add(settingsButton);
    this.controlBar.settingsButton = settingsButton; // for menu positioning

    // cloudButton
    button = new PushButtonMorph(
        this,
        'cloudMenu',
        new SymbolMorph('cloud', 11)
    );
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    button.drawNew();
    // button.hint = 'cloud operations';
    button.fixLayout();
    cloudButton = button;
    this.controlBar.add(cloudButton);
    this.controlBar.cloudButton = cloudButton; // for menu positioning

    this.controlBar.fixLayout = function () {
        x = this.right() - padding;
        [stopButton, pauseButton, startButton].forEach(
            function (button) {
                button.setCenter(myself.controlBar.center());
                button.setRight(x);
                x -= button.width();
                x -= padding;
            }
        );

        x = myself.right() - (StageMorph.prototype.dimensions.x
            * (myself.isSmallStage ? myself.stageRatio : 1));

        [stageSizeButton, appModeButton].forEach(
            function (button) {
                x += padding;
                button.setCenter(myself.controlBar.center());
                button.setLeft(x);
                x += button.width();
            }
        );

        settingsButton.setCenter(myself.controlBar.center());
        settingsButton.setLeft(this.left() + 100); // xinni: new logo is bigger, hence shifted top buttons right.

        cloudButton.setCenter(myself.controlBar.center());
        cloudButton.setRight(settingsButton.left() - padding);

        projectButton.setCenter(myself.controlBar.center());
        projectButton.setRight(cloudButton.left() - padding);

        this.updateLabel();
        this.updateUsernameLabel();
    };

    this.controlBar.updateLabel = function () {
        var suffix = myself.world().isDevMode ?
            ' - ' + localize('development mode') : '';

        if (this.label) {
            this.label.destroy();
        }
        if (myself.isAppMode) {
            return;
        }

        this.label = new StringMorph(
                (myself.projectName || localize('untitled')) + suffix,
            14,
            'sans-serif',
            true,
            false,
            false,
            MorphicPreferences.isFlat ? null : new Point(2, 1),
            myself.frameColor.darker(myself.buttonContrast)
        );
        this.label.color = myself.buttonLabelColor;
        this.label.drawNew();
        this.add(this.label);
        this.label.setCenter(this.center());
        this.label.setLeft(this.settingsButton.right() + padding);
    };

    this.controlBar.updateUsernameLabel = function () {

        if (this.usernameLabel) {
            this.usernameLabel.destroy();
        }
        if (myself.isAppMode) {
            return;
        }

        this.usernameLabel = new StringMorph(
            "Logged in as: " + tempIdentifier,
            12,
            'sans-serif',
            true,
            false,
            false,
            MorphicPreferences.isFlat ? null : new Point(2, 1),
            myself.frameColor.darker(myself.buttonContrast)
        );
        this.usernameLabel.color = new Color(60, 158, 0);
        this.usernameLabel.drawNew();
        this.add(this.usernameLabel);
        this.usernameLabel.setCenter(this.center());
        this.usernameLabel.setRight(myself.controlBar.stageSizeButton.left() - padding*3);
    };
};

IDE_Morph.prototype.createCategories = function () {
    // assumes the logo has already been created
    var myself = this;

    if (this.categories) {
        this.categories.destroy();
    }
    this.categories = new Morph();
    this.categories.color = this.groupColor;
    this.categories.silentSetWidth(this.logo.width()); // width is fixed

    function addCategoryButton(category) {
        var labelWidth = 75,
            colors = [
                myself.frameColor,
                myself.frameColor.darker(50),
                SpriteMorph.prototype.blockColor[category]
            ],
            button;

        button = new ToggleButtonMorph(
            colors,
            myself, // the IDE is the target
            function () {
                myself.currentCategory = category;
                myself.categories.children.forEach(function (each) {
                    each.refresh();
                });
                myself.refreshPalette(true);
            },
            category[0].toUpperCase().concat(category.slice(1)), // label
            function () {  // query
                return myself.currentCategory === category;
            },
            null, // env
            null, // hint
            null, // template cache
            labelWidth, // minWidth
            true // has preview
        );

        button.corner = 8;
        button.padding = 0;
        button.labelShadowOffset = new Point(-1, -1);
        button.labelShadowColor = colors[1];
        button.labelColor = myself.buttonLabelColor;
        button.fixLayout();
        button.refresh();
        myself.categories.add(button);
        return button;
    }

    function fixCategoriesLayout() {
        var buttonWidth = myself.categories.children[0].width(),
            buttonHeight = myself.categories.children[0].height(),
            border = 3,
            rows = Math.ceil((myself.categories.children.length) / 2),
            xPadding = (myself.categories.width()
                - border
                - buttonWidth * 2) / 3,
            yPadding = 2,
            l = myself.categories.left(),
            t = myself.categories.top(),
            i = 0,
            row,
            col;

        myself.categories.children.forEach(function (button) {
            i += 1;
            row = Math.ceil(i / 2);
            col = 2 - (i % 2);
            button.setPosition(new Point(
                    l + (col * xPadding + ((col - 1) * buttonWidth)),
                    t + (row * yPadding + ((row - 1) * buttonHeight) + border)
            ));
        });

        myself.categories.setHeight(
                (rows + 1) * yPadding
                + rows * buttonHeight
                + 2 * border
        );
    }

    SpriteMorph.prototype.categories.forEach(function (cat) {
        if (!contains(['lists', 'other'], cat)) {
            addCategoryButton(cat);
        }
    });
    fixCategoriesLayout();
    this.add(this.categories);
};

IDE_Morph.prototype.createPalette = function (forSearching) {
    // assumes that the logo pane has already been created
    // needs the categories pane for layout
    var myself = this;

    if (this.palette) {
        this.palette.destroy();
    }

    if (forSearching) {
        this.palette = new ScrollFrameMorph(
            null,
            null,
            this.currentSprite.sliderColor
        );
    } else {
        this.palette = this.currentSprite.palette(this.currentCategory);
    }
    this.palette.isDraggable = false;
    this.palette.acceptsDrops = true;
    this.palette.contents.acceptsDrops = false;

    this.palette.reactToDropOf = function (droppedMorph) {
        if (droppedMorph instanceof DialogBoxMorph) {
            myself.world().add(droppedMorph);
        } else if (droppedMorph instanceof SpriteMorph) {
            myself.removeSprite(droppedMorph);
        } else if (droppedMorph instanceof SpriteIconMorph) {
            droppedMorph.destroy();
            myself.removeSprite(droppedMorph.object);
        } else if (droppedMorph instanceof CostumeIconMorph) {
            myself.currentSprite.wearCostume(null);
            droppedMorph.destroy();
        } else {
            droppedMorph.destroy();
        }
    };

    this.palette.setWidth(this.logo.width());
    this.add(this.palette);
    return this.palette;
};

IDE_Morph.prototype.createStage = function () {
    // assumes that the logo pane has already been created
    if (this.stage) {
        this.stage.destroy();
    }
    StageMorph.prototype.frameRate = 0;
    this.stage = new StageMorph(this.globalVariables);
    this.stage.setExtent(this.stage.dimensions); // dimensions are fixed
    if (this.currentSprite instanceof SpriteMorph) {
        this.currentSprite.setPosition(
            this.stage.center().subtract(
                this.currentSprite.extent().divideBy(2)
            )
        );
        this.stage.add(this.currentSprite);
    }
    this.add(this.stage);
};

IDE_Morph.prototype.createSpriteBar = function () {
    // assumes that the categories pane has already been created
    var rotationStyleButtons = [],
        thumbSize = new Point(45, 45),
        nameField,
        padlock,
        thumbnail,
        tabCorner = 15,
        tabColors = this.tabColors,
        tabBar = new AlignmentMorph('row', -tabCorner * 2),
        tab,
        symbols = ['\u2192', '\u21BB', '\u2194'],
        labels = ['don\'t rotate', 'can rotate', 'only face left/right'],
        myself = this;

    if (this.spriteBar) {
        this.spriteBar.destroy();
    }

    this.spriteBar = new Morph();
    this.spriteBar.color = this.frameColor;
    this.add(this.spriteBar);

    function addRotationStyleButton(rotationStyle) {
        var colors = myself.rotationStyleColors,
            button;

        button = new ToggleButtonMorph(
            colors,
            myself, // the IDE is the target
            function () {
                if (myself.currentSprite instanceof SpriteMorph) {
                    myself.currentSprite.rotationStyle = rotationStyle;
                    myself.currentSprite.changed();
                    myself.currentSprite.drawNew();
                    myself.currentSprite.changed();
                }
                rotationStyleButtons.forEach(function (each) {
                    each.refresh();
                });
            },
            symbols[rotationStyle], // label
            function () {  // query
                return myself.currentSprite instanceof SpriteMorph
                    && myself.currentSprite.rotationStyle === rotationStyle;
            },
            null, // environment
            localize(labels[rotationStyle])
        );

        button.corner = 8;
        button.labelMinExtent = new Point(11, 11);
        button.padding = 0;
        button.labelShadowOffset = new Point(-1, -1);
        button.labelShadowColor = colors[1];
        button.labelColor = myself.buttonLabelColor;
        button.fixLayout();
        button.refresh();
        rotationStyleButtons.push(button);
        button.setPosition(myself.spriteBar.position().add(2));
        button.setTop(button.top()
                + ((rotationStyleButtons.length - 1) * (button.height() + 2))
        );
        myself.spriteBar.add(button);
        if (myself.currentSprite instanceof StageMorph) {
            button.hide();
        }
        return button;
    }

    addRotationStyleButton(1);
    addRotationStyleButton(2);
    addRotationStyleButton(0);
    this.rotationStyleButtons = rotationStyleButtons;

    thumbnail = new Morph();
    thumbnail.setExtent(thumbSize);
    thumbnail.image = this.currentSprite.thumbnail(thumbSize);
    thumbnail.setPosition(
        rotationStyleButtons[0].topRight().add(new Point(5, 3))
    );
    this.spriteBar.add(thumbnail);

    thumbnail.fps = 3;

    thumbnail.step = function () {
        if (thumbnail.version !== myself.currentSprite.version) {
            thumbnail.image = myself.currentSprite.thumbnail(thumbSize);
            thumbnail.changed();
            thumbnail.version = myself.currentSprite.version;
        }
    };

    nameField = new InputFieldMorph(this.currentSprite.name);
    nameField.setWidth(100); // fixed dimensions
    nameField.contrast = 90;
    nameField.setPosition(thumbnail.topRight().add(new Point(10, 3)));
    this.spriteBar.add(nameField);
    nameField.drawNew();
    nameField.accept = function () {
        var newName = nameField.getValue();
        myself.currentSprite.setName(
            myself.newSpriteName(newName, myself.currentSprite)
        );
        nameField.setContents(myself.currentSprite.name);
    };
    this.spriteBar.reactToEdit = nameField.accept;

    // padlock
    padlock = new ToggleMorph(
        'checkbox',
        null,
        function () {
            myself.currentSprite.isDraggable = !myself.currentSprite.isDraggable;
        },
        localize('draggable'),
        function () {
            return myself.currentSprite.isDraggable;
        }
    );
    padlock.label.isBold = false;
    padlock.label.setColor(this.buttonLabelColor);
    padlock.color = tabColors[2];
    padlock.highlightColor = tabColors[0];
    padlock.pressColor = tabColors[1];

    padlock.tick.shadowOffset = MorphicPreferences.isFlat ?
        new Point() : new Point(-1, -1);
    padlock.tick.shadowColor = new Color(); // black
    padlock.tick.color = this.buttonLabelColor;
    padlock.tick.isBold = false;
    padlock.tick.drawNew();

    padlock.setPosition(nameField.bottomLeft().add(2));
    padlock.drawNew();
    this.spriteBar.add(padlock);
    if (this.currentSprite instanceof StageMorph) {
        padlock.hide();
    }

    // tab bar
    tabBar.tabTo = function (tabString) {
        var active;
        myself.currentTab = tabString;
        this.children.forEach(function (each) {
            each.refresh();
            if (each.state) {
                active = each;
            }
        });
        active.refresh(); // needed when programmatically tabbing
        myself.createSpriteEditor();
        myself.fixLayout('tabEditor');
    };

    tab = new TabMorph(
        tabColors,
        null, // target
        function () {
            tabBar.tabTo('scripts');
        },
        localize('Scripts'), // label
        function () {  // query
            return myself.currentTab === 'scripts';
        }
    );
    tab.padding = 3;
    tab.corner = tabCorner;
    tab.edge = 1;
    tab.labelShadowOffset = new Point(-1, -1);
    tab.labelShadowColor = tabColors[1];
    tab.labelColor = this.buttonLabelColor;
    tab.drawNew();
    tab.fixLayout();
    tabBar.add(tab);

    tab = new TabMorph(
        tabColors,
        null, // target
        function () {
            tabBar.tabTo('costumes');
        },
        localize('Costumes'), // label
        function () {  // query
            return myself.currentTab === 'costumes';
        }
    );
    tab.padding = 3;
    tab.corner = tabCorner;
    tab.edge = 1;
    tab.labelShadowOffset = new Point(-1, -1);
    tab.labelShadowColor = tabColors[1];
    tab.labelColor = this.buttonLabelColor;
    tab.drawNew();
    tab.fixLayout();
    tabBar.add(tab);

    tab = new TabMorph(
        tabColors,
        null, // target
        function () {
            tabBar.tabTo('sounds');
        },
        localize('Sounds'), // label
        function () {  // query
            return myself.currentTab === 'sounds';
        }
    );
    tab.padding = 3;
    tab.corner = tabCorner;
    tab.edge = 1;
    tab.labelShadowOffset = new Point(-1, -1);
    tab.labelShadowColor = tabColors[1];
    tab.labelColor = this.buttonLabelColor;
    tab.drawNew();
    tab.fixLayout();
    tabBar.add(tab);

    tabBar.fixLayout();
    tabBar.children.forEach(function (each) {
        each.refresh();
    });
    this.spriteBar.tabBar = tabBar;
    this.spriteBar.add(this.spriteBar.tabBar);

    this.spriteBar.fixLayout = function () {
        this.tabBar.setLeft(this.left());
        this.tabBar.setBottom(this.bottom() + 75);
    };
};

IDE_Morph.prototype.createSpriteEditor = function () {
    // assumes that the logo pane and the stage have already been created
    var scripts = this.currentSprite.scripts,
        myself = this;

    if (this.spriteEditor) {
        this.spriteEditor.destroy();
    }

    if (this.currentTab === 'scripts') {
        scripts.isDraggable = false;
        scripts.color = this.groupColor;
        scripts.texture = this.scriptsPaneTexture;

        this.spriteEditor = new ScrollFrameMorph(
            scripts,
            null,
            this.sliderColor
        );
        this.spriteEditor.padding = 10;
        this.spriteEditor.growth = 50;
        this.spriteEditor.isDraggable = false;
        this.spriteEditor.acceptsDrops = false;
        this.spriteEditor.contents.acceptsDrops = true;

        scripts.scrollFrame = this.spriteEditor;
        this.add(this.spriteEditor);
        this.spriteEditor.scrollX(this.spriteEditor.padding);
        this.spriteEditor.scrollY(this.spriteEditor.padding);
    } else if (this.currentTab === 'costumes') {
        this.spriteEditor = new WardrobeMorph(
            this.currentSprite,
            this.sliderColor
        );
        this.spriteEditor.color = this.groupColor;
        this.add(this.spriteEditor);
        this.spriteEditor.updateSelection();

        this.spriteEditor.acceptsDrops = false;
        this.spriteEditor.contents.acceptsDrops = false;
    } else if (this.currentTab === 'sounds') {
        this.spriteEditor = new JukeboxMorph(
            this.currentSprite,
            this.sliderColor
        );
        this.spriteEditor.color = this.groupColor;
        this.add(this.spriteEditor);
        this.spriteEditor.updateSelection();
        this.spriteEditor.acceptDrops = false;
        this.spriteEditor.contents.acceptsDrops = false;
    } else {
        this.spriteEditor = new Morph();
        this.spriteEditor.color = this.groupColor;
        this.spriteEditor.acceptsDrops = true;
        this.spriteEditor.reactToDropOf = function (droppedMorph) {
            if (droppedMorph instanceof DialogBoxMorph) {
                myself.world().add(droppedMorph);
            } else if (droppedMorph instanceof SpriteMorph) {
                myself.removeSprite(droppedMorph);
            } else {
                droppedMorph.destroy();
            }
        };
        this.add(this.spriteEditor);
    }
};

IDE_Morph.prototype.createCorralBar = function () {
	var myself = this;
	var mine = this.library;
    // assumes the stage has already been created
    var padding = 5,
        newbutton,
        paintbutton,
        librarybutton,
        colors = [
            this.groupColor,
            this.frameColor.darker(50),
            this.frameColor.darker(50)
        ];

    if (this.corralBar) {
        this.corralBar.destroy();
    }

    this.corralBar = new Morph();
    this.corralBar.color = this.frameColor;
    this.corralBar.setHeight(this.logo.height()); // height is fixed
    this.add(this.corralBar);

    // NEW SPRITE BUTTON ///////////////////////////////////////////
    button = new PushButtonMorph(
        this,
        "addNewSprite",
        new SymbolMorph("turtle", 14),
        null,
        null,
        null,
        "symbolButton"
    );
    button.drawNew();
    button.hint = 'Add a new Turtle sprite';
    button.fixLayout();
    newbutton = button;
    newbutton.setCenter(this.corralBar.center());
    newbutton.setLeft(this.corralBar.left() + padding);
    this.corralBar.add(newbutton);

    // PAINT BUTTON ////////////////////////////////////////////////
    button = new PushButtonMorph(
        this,
        "paintNewSprite",
        new SymbolMorph("brush",15),
        null,
        null,
        null,
        "symbolButton"
    );
    button.drawNew();
    button.hint = 'Paint a new sprite';
    button.fixLayout();
    paintbutton = button;
    paintbutton.setCenter(this.corralBar.center());
    paintbutton.setTop(newbutton.bottom() + padding);
    this.corralBar.add(paintbutton);

    // IMPORT FROM LIBRARY /////////////////////////////////////////
    button = new PushButtonMorph(
        this,
        function (){
			myself.refreshPage = 1;
			myself.openLibrary();
			//mine.destroy();
		},
        (String.fromCharCode("0xf03e")),
        null,
        null,
        null,
        "iconButton"
    );
    button.hint = 'Open library';
    button.fixLayout();
    librarybutton = button;
    librarybutton.setCenter(this.corralBar.center());
    librarybutton.setTop(paintbutton.bottom() + padding);
    this.corralBar.add(librarybutton);
    librarybutton.drawNew();
    librarybutton.fixLayout();
};

IDE_Morph.prototype.createCorral = function () {
    // assumes the corral bar has already been created
    var frame, template, padding = 5, myself = this;

    if (this.corral) {
        this.corral.destroy();
    }

    this.corral = new Morph();
    this.corral.color = this.groupColor;
    this.add(this.corral);

    this.corral.stageIcon = new SpriteIconMorph(this.stage);
    this.corral.stageIcon.isDraggable = false;
    //this.corral.stageIcon.setPosition(new Point(0,-20));
    this.corral.add(this.corral.stageIcon);

    //this.corral.stageIcon = new SpriteIconMorph(this.stage);
    //this.corral.stageIcon.isDraggable = false;
    //this.corral.add(this.corral.stageIcon);

    frame = new ScrollFrameMorph(null, null, this.sliderColor);
    frame.acceptsDrops = false;
    frame.contents.acceptsDrops = false;

    frame.contents.wantsDropOf = function (morph) {
        return morph instanceof SpriteIconMorph;
    };

    frame.contents.reactToDropOf = function (spriteIcon) {
        myself.corral.reactToDropOf(spriteIcon);
    };

    frame.alpha = 0;

    this.sprites.asArray().forEach(function (morph) {
        template = new SpriteIconMorph(morph, template);
        frame.contents.add(template);
    });

    this.corral.frame = frame;
    this.corral.add(frame);

    this.corral.fixLayout = function () {
        //this.stageIcon.setCenter(this.center());
        //this.stageIcon.setLeft(this.left() + padding);
        this.frame.setLeft(this.stageIcon.right() + padding);
        this.frame.setExtent(new Point(
                this.right() - this.frame.left(),
            this.height()
        ));
        this.arrangeIcons();
        this.refresh();
    };

    this.corral.arrangeIcons = function () {
        var x = this.frame.left(),
            y = this.frame.top(),
            max = this.frame.right(),
            start = this.frame.left();

        this.frame.contents.children.forEach(function (icon) {
            var w = icon.width();

            if (x + w > max) {
                x = start;
                y += icon.height(); // they're all the same
            }
            icon.setPosition(new Point(x, y));
            x += w;
        });
        this.frame.contents.adjustBounds();
    };

    this.corral.addSprite = function (sprite) {
        this.frame.contents.add(new SpriteIconMorph(sprite));
        this.fixLayout();
    };

    this.corral.refresh = function () {
        this.stageIcon.refresh();
        this.frame.contents.children.forEach(function (icon) {
            icon.refresh();
        });
    };

    this.corral.wantsDropOf = function (morph) {
        return morph instanceof SpriteIconMorph;
    };

    this.corral.reactToDropOf = function (spriteIcon) {
        var idx = 1,
            pos = spriteIcon.position();
        spriteIcon.destroy();
        this.frame.contents.children.forEach(function (icon) {
            if (pos.gt(icon.position()) || pos.y > icon.bottom()) {
                idx += 1;
            }
        });
        myself.sprites.add(spriteIcon.object, idx);
        myself.createCorral();
        myself.fixLayout();
    };

};

// ****************************
// SHAREBOX
// ****************************

// xinni: "settings" and "add member" buttons on the title bar.
IDE_Morph.prototype.createShareBoxTitleBarButtons = function () {

    // destroy if already exists
    if (this.shareBoxTitleBarButtons) {
        this.shareBoxTitleBarButtons.destroy();
    }

    // initialize frame holder for buttons.
    this.shareBoxTitleBarButtons = new FrameMorph();
    this.shareBoxTitleBarButtons.setColor(this.groupColor.darker(20));
    this.add(this.shareBoxTitleBarButtons);

    console.log("Create sharebox buttons");

    // settings button
    button = new PushButtonMorph(
        this,
        'shareBoxSettingsMenu',
        new SymbolMorph('gears', 14),
        null,
        null,
        null,
        "symbolButton"
    );
    button.drawNew();
    button.fixLayout();
    shareBoxSettingsButton = button;


    // add member button
    button = new PushButtonMorph(
        this,
        "showAddMemberPopup",
        (String.fromCharCode("0xf067")),
        null,
        null,
        null,
        "iconButton"
    );
    button.drawNew();
    button.hint = 'New Member';
    button.fixLayout();
    shareBoxAddMemberButton = button;
	
	// make announcement button
    button = new PushButtonMorph(
        null,
		null,
        "Make Announcement",
        null,
        null,
        null,
        "iconButton"
    );
    button.drawNew();
    button.hint = 'New Member';
    button.fixLayout();
    shareBoxAnnoucementButton = button;
	
	shareBoxAnnoucementButton.action = function() {
         var result = "success";

         if (result === "success") {
			 var message = prompt("What's your announcement?");
			 if (message) {
				 socketData = { room: myself.shareboxId, msg: message};
				 myself.sharer.socket.emit('SEND_ANNOUNCEMENT', socketData);
			 }
         } 
     }


    // add to title bar
    this.shareBoxTitleBarButtons.add(shareBoxSettingsButton);
    this.shareBoxTitleBarButtons.shareBoxSettingsButton = shareBoxSettingsButton;
    this.shareBoxTitleBarButtons.add(shareBoxAddMemberButton);
    this.shareBoxTitleBarButtons.shareBoxAddMemberButton = shareBoxAddMemberButton;
	this.shareBoxTitleBarButtons.add(shareBoxAnnoucementButton);
    this.shareBoxTitleBarButtons.shareBoxAnnoucementButton = shareBoxAnnoucementButton;

    // position buttons
    if (this.shareBoxTitleBarButtons) {
        
		
		// position add new member button
        this.shareBoxTitleBarButtons.shareBoxAnnoucementButton.setLeft(this.shareBoxTitleBarButtons.left());
        this.shareBoxTitleBarButtons.shareBoxAnnoucementButton.setTop(this.shareBoxTitleBarButtons.top() + 2);
		
		// position announcement button
        this.shareBoxTitleBarButtons.shareBoxAddMemberButton.setTop(this.shareBoxTitleBarButtons.top() + 2);
        this.shareBoxTitleBarButtons.shareBoxAddMemberButton.setLeft(this.shareBoxTitleBarButtons.shareBoxAnnoucementButton.right());

        // position settings button
        this.shareBoxTitleBarButtons.shareBoxSettingsButton.setTop(this.shareBoxTitleBarButtons.top() + 2);
        this.shareBoxTitleBarButtons.shareBoxSettingsButton.setLeft(this.shareBoxTitleBarButtons.shareBoxAddMemberButton.right());
    }

    this.fixLayout();
    this.shareBoxTitleBarButtons.fixLayout = function () {    };

}

// xinni: title bar that says 'SHAREBOX'.
IDE_Morph.prototype.createShareBoxTitleBar = function () {
    // destroy if already exists
    if (this.shareBoxTitleBar) {
        this.shareBoxTitleBar.destroy();
    }

    // initialize frame
    this.shareBoxTitleBar = new FrameMorph();
    this.shareBoxTitleBar.setColor(this.groupColor.darker(20));

    // initialize title "ShareBox"
    if (this.shareboxId == "No Group Yet" || this.shareboxId == null) { // no group
        this.shareBoxTitle = new StringMorph("ShareBox: No Group Yet", 14, 'sans-serif', true, false, false, null, this.frameColor.darker(this.buttonContrast));
    } else { // has group
        this.shareBoxTitle = new StringMorph("ShareBox: " + this.shareboxId + "'s group", 14, 'sans-serif', true, false, false, null, this.frameColor.darker(this.buttonContrast));
    }

    console.log(this.shareboxId);

    this.shareBoxTitle.setLeft(this.shareBoxTitleBar.left() + 5);
    this.shareBoxTitle.setTop(this.shareBoxTitleBar.top() + 5);
    this.shareBoxTitle.setWidth(200);
    this.shareBoxTitle.drawNew();
    this.shareBoxTitleBar.add(this.shareBoxTitle);

    // add to myself
    this.add(this.shareBoxTitleBar);

    this.shareBoxTitle.fixLayout = function() {
    };
}

// xinni: the 'scripts' and 'assets' tabs.
IDE_Morph.prototype.createShareBoxBar = function () {
    var
        tabCorner = 15,
        tabColors = this.tabColors,
        tabBar = new AlignmentMorph('row', -tabCorner * 2),
        tab,
        myself = this;

    if (this.shareBoxBar) {
        this.shareBoxBar.destroy();
    }

    // delete the connect bar if sharebox is in operation
    if (this.shareBoxConnectBar) {
        this.shareBoxConnectBar.destroy();
    }

    this.shareBoxBar = new Morph();
    this.shareBoxBar.bounds = new Rectangle(0, 0, 0, 0); // xinni: remove unwanted floating rectangle
    this.shareBoxBar.color = null;
    this.add(this.shareBoxBar);

    /*
     // tab bar
     tabBar.tabTo = function (tabString) {
     var active;
     myself.currentShareBoxTab = tabString;
     this.children.forEach(function (each) {
     each.refresh();
     if (each.state) {active = each; }
     });
     active.refresh(); // needed when programmatically tabbing
     if (tabString === 'scripts') {
     if (!myself.shareBox) {
     myself.createShareBox();
     myself.shareAssetsBox.hide();
     myself.shareAssetsBox.destroy();
     } else {
     myself.shareBox.show();
     myself.shareAssetsBox.hide();
     myself.shareAssetsBox.destroy();
     }
     } else {
     if (!myself.shareAssetsBox) {
     myself.createShareAssetsBox();
     myself.shareBox.hide();
     myself.shareBox.destroy();
     } else {
     myself.shareAssetsBox.show();
     myself.shareBox.hide();
     myself.shareBox.destroy();
     }
     }
     myself.fixLayout('tabEditor');
     };
     */

    //Experiment-----------------------------------
    tabBar.tabTo = function (tabString) {
        var active;
        myself.currentShareBoxTab = tabString;
        this.children.forEach(function (each) {
            each.refresh();
            if (each.state) {
                active = each;
            }
        });
        active.refresh(); // needed when programmatically tabbing
        myself.createShareBox(this.shareboxId);
        myself.fixLayout('tabEditor');
    };
    //---------------------------------------------

    tab = new TabMorph(
        tabColors,
        null, // target
        function () {
            tabBar.tabTo('scripts');
        },
        localize('Scripts'), // label
        function () {  // query
            return myself.currentShareBoxTab === 'scripts';
        }
    );
    tab.padding = 3;
    tab.corner = tabCorner;
    tab.edge = 1;
    tab.labelShadowOffset = new Point(-1, -1);
    tab.labelShadowColor = tabColors[1];
    tab.labelColor = this.buttonLabelColor;
    tab.drawNew();
    tab.fixLayout();
    tabBar.add(tab);
    tab = new TabMorph(
        tabColors,
        null, // target
        function () {
            tabBar.tabTo('assets');
        },
        localize('Assets'), // label
        function () {  // query
            return myself.currentShareBoxTab === 'assets';
        }
    );
    tab.padding = 3;
    tab.corner = tabCorner;
    tab.edge = 1;
    tab.labelShadowOffset = new Point(-1, -1);
    tab.labelShadowColor = tabColors[1];
    tab.labelColor = this.buttonLabelColor;
    tab.drawNew();
    tab.fixLayout();
    //tab.setPosition(new Point(500,500));
    tabBar.add(tab);


    tabBar.fixLayout();
    tabBar.children.forEach(function (each) {
        each.refresh();
    });
    this.shareBoxBar.tabBar = tabBar;
    this.shareBoxBar.add(this.shareBoxBar.tabBar);

    this.shareBoxBar.fixLayout = function () {
        this.setExtent(new Point(
                this.right() - this.left(),
            this.height()
        ));
        this.tabBar.setLeft(this.left());
        this.tabBar.setBottom(this.bottom() + 75);
    };

    //myself.fixLayout();
};

function drawShareBoxPrototypeUsingImage(myself, image) {
    var sharebox = new Morph();
    sharebox.texture = image;
    sharebox.drawNew = function () {
        this.image = newCanvas(this.extent());
        var context = this.image.getContext('2d');
        var picBgColor = myself.shareBox.color;
        context.fillStyle = picBgColor.toString();
        context.fillRect(0, 0, this.width(), this.height());
        if (this.texture) {
            this.drawTexture(this.texture);
        }
    };
    sharebox.setExtent(new Point(448, 265));
    sharebox.setLeft(this.stage.width() / 2 - sharebox.width() / 2);
    sharebox.setTop(-2);
    return sharebox;
};

function buildInvisibleButton(action, point, left, top) {
    var button = new TriggerMorph(
        this,
        action,
        "", 10, 'sans serif', null);
    button.setExtent(point);
    button.setLeft(left);
    button.setTop(top);
    button.setAlphaScaled(0);
    return button;
};

// Tang Huan Song: I'll be Morphing this prototype function slowly into the fully-functional function (puns intended)

IDE_Morph.makeSocket = function (myself, shareboxId) {
    // First Screen: Script drag behavior to load the next screen for naming.
    // Override default behavior
    var shareBoxPlaceholderSprite = myself.shareBoxPlaceholderSprite;
    //var shareBoxBGEmpty = drawShareBoxPrototypeUsingImage.call(this, myself, 'images/sharebox_prototype.png');
    //this.shareBox.add(shareBoxBGEmpty);
    var serializer = this.serializer,
        ide = this,
        socket = io();

    console.log(myself);
    console.log(ide);



    var sharer = new ShareBoxItemSharer(serializer, ide, socket);



    //sharer.socket.emit('join', {id: tempIdentifier, room: room });
    //console.log(tempIdentifier +": join room " + room);

    sharer.socket.on('NEW_MEMBER_JOINED', function(data) {
        console.log("[SOCKET-RECEIVE] NEW_MEMBER_JOINED: " + JSON.stringify(data))
    });

    sharer.socket.on('BE_REMOVED', function(data){
        myself.showYouHaveBeenRemovedPopup();
        console.log("[SOCKET-RECEIVE] BE_REMOVED: " + JSON.stringify(data));
    })

    sharer.socket.on('INVITE_JOIN', function(data){
        if(data.inviteId == tempIdentifier){
            myself.showRequestReceivedMessage(data);
            console.log("[SOCKET-RECEIVE] INVITE_JOIN: " + JSON.stringify(data));
        }
    })

    sharer.socket.on('DISBAND_SHAREBOX', function(data){
        myself.showYouHaveBeenRemovedPopup();
        console.log("[SOCKET-RECEIVE] DISBAND_SHAREBOX: " + JSON.stringify(data));
    })

    sharer.socket.on('UPDATE_SHAREBOX_VIEW', function(data) {
        console.log("UPDATE_SHAREBOX_VIEW");
        ide.sharer.data.data = data;
        ide.createShareBox();
        ide.shareBox.updateList();
    })
	
	sharer.socket.on('ANNOUNCEMENT_SENT', function(data) {
        console.log("[SOCKET-RECEIVE] ANNOUNCEMENT_SENT: " + JSON.stringify(data))
		if (tempIdentifier != data.room) { // is not the owner (aka sender of msg)
			myself.showAnnouncementPopup(data.msg);
		}
    });
	
	sharer.socket.on('MESSAGE_READ', function(data) {
        console.log("[SOCKET-RECEIVE] MESSAGE_READ: " + JSON.stringify(data))
		console.log("MESSAGE_READ: " + tempIdentifier + " " + data.room);
		if (tempIdentifier == data.room) { // is the owner (aka sender of msg)
			myself.showAnnouncementReadPopup();
		}
    })	

    // When I receive data, I parse objectData and add it to my data list
    sharer.socket.on('UPDATE_SHAREBOX_VIEW', function (objectData) {
        // Clean up shareBoxPlaceholderSprite
        var duplicate = this.ide.currentSprite.fullCopy();
        var curr = this.ide.currentSprite;
        sharer.ide.shareBoxPlaceholderSprite.sounds = new List();
        sharer.ide.shareBoxPlaceholderSprite.costumes = new List();
        sharer.ide.shareBoxPlaceholderSprite.costume = null;
        sharer.ide.shareBoxPlaceholderSprite.scriptsList = new List();
        //var duplicate = sharer.ide.currentSprite.fullCopy();

        // Update local list
        sharer.data.data = objectData;
        console.log("draw following code in sharebox: \n" + JSON.stringify(sharer.data, null, '\t'));
        for (var i = 0; i < sharer.data.data.length; i++) {
            var shareObject = sharer.getObject(_.unescape(sharer.data.data[i].string));
            if (shareObject instanceof CostumeIconMorph) {
                shareObject.object.name = sharer.data.data[i].name;
                sharer.ide.shareBoxPlaceholderSprite.addCostume(shareObject.object);
            } else if (shareObject instanceof SoundIconMorph) {
                shareObject.object.name = sharer.data.data[i].name;
                sharer.ide.shareBoxPlaceholderSprite.addSound(shareObject.object, shareObject.object.name);
            } else if (shareObject instanceof CommandBlockMorph) {
                shareObject.name = sharer.data.data[i].name;
                sharer.ide.shareBoxPlaceholderSprite.scriptsList.add(shareObject);
                sharer.ide.shareBox.updateList();
            }
            shareObject.destroy();
        }
        console.log(myself);
        //sharer.ide.currentSprite = duplicate;
        this.ide.removeSprite(curr);
        this.ide.currentSprite = duplicate;
        this.ide.currentSprite.appearIn(this.ide);
        this.ide.selectSprite(this.ide.currentSprite);

        sharer.ide.shareBoxPlaceholderSprite.hasChangedMedia = true;
        this.ide.createShareBox();
        sharer.ide.drawNew();
        sharer.ide.fixLayout();
    }.bind(sharer));


    
    return sharer;
};

IDE_Morph.prototype.isValidName = function (shareName) {
    return !(shareName == null || shareName.length == 0 || shareName.length > 50);
};

// xinni: shows the whole share box and hide the connection screens and tabs
IDE_Morph.prototype.createShareBox = function () {
    // Initialization of Sharebox and its default behavior
    var scripts = this.shareBoxPlaceholderSprite.scripts,
        myself = this;
        

    shareboxId = typeof myself.shareboxId !== 'undefined' ? myself.shareboxId : 'No Group Yet';
    
    var room = shareboxId.toString();

    // Destroy if sharebox exists
    if (this.shareBox) {
        this.shareBox.destroy();
    }

    // delete the connect morph if sharebox is in operation
    if (this.shareBoxConnect) {
        this.shareBoxConnect.destroy();
    }

    //var sharer = IDE_Morph.makeSocket.call(this, myself, shareboxId);
    var sharer = this.sharer;
    this.sharer.room = room;
    // join the room that was created
    var socketData = {id: tempIdentifier, room: room }
    if (myself.shareboxId !== 'No Group Yet'){
         sharer.socket.emit('JOIN_SHAREBOX', socketData);
        console.log("[SOCKET-SEND] JOIN_SHAREBOX: " + JSON.stringify(socketData));
    }

    if (this.currentShareBoxTab === 'scripts') {
        scripts.isDraggable = false;
        scripts.color = this.groupColor;
        scripts.texture = this.scriptsPaneTexture;

        this.shareBox = new ShareBoxScriptsMorph(this.shareBoxPlaceholderSprite, this);
        this.shareBox.color = this.groupColor;
        this.shareBox.acceptsDrops = true;
        this.add(this.shareBox);

        this.shareBox.reactToDropOf = function (droppedMorph) {
            var shareName = prompt("Give the item a name.");
            while (!sharer.ide.isValidName(shareName)) {
                shareName = prompt("The name has to be between 1 to 20 characters");
            }
            sharer.shareObject((shareboxId.toString()), droppedMorph, shareName);
            var restored = world.hand.children[0].fullCopy();
            console.log(restored)
            world.hand.children = [];
            myself.spriteEditor.contents.add(restored);
            restored.setPosition(world.hand.grabOrigin.position);
            restored.changed();
            restored.removeShadow();
            world.hand.drop();
            myself.fixLayout();
        };
    } else if (this.currentShareBoxTab === 'assets') {
        this.shareBox = new ShareBoxAssetsMorph(
            this.shareBoxPlaceholderSprite,
            this.sliderColor
        );
        this.shareBox.color = this.groupColor;
        this.add(this.shareBox);
        //this.addChild(this.shareBox);
        this.shareBox.updateSelection();

        this.shareBox.acceptsDrops = true;

        this.shareBox.reactToDropOf = function (droppedMorph) {
            if (droppedMorph instanceof SoundIconMorph || droppedMorph instanceof CostumeIconMorph) {
                var shareName = prompt("Give the item a name.");
                while (!sharer.ide.isValidName(shareName)) {
                    shareName = prompt("The name has to be between 1 to 20 characters");
                }
                sharer.shareObject((shareboxId.toString()), droppedMorph, shareName);
                droppedMorph.destroy();
                myself.fixLayout();
            }
            droppedMorph.destroy();
        };

    } else {

        //this.shareBox = new Morph();
        this.shareBox = new ShareBoxScriptsMorph(this.shareBoxPlaceholderSprite, this);

        this.shareBox.color = this.groupColor;
        this.shareBox.acceptsDrops = true;

        this.shareBox.reactToDropOf = function (droppedMorph) {
            if (droppedMorph instanceof BlockMorph) {
                this.world().add(droppedMorph);
            } else {
                droppedMorph.destroy();
            }
        };
        this.addChild(this.shareBox);
    }


};


// destroys sharebox and goes back to sharebox connect
IDE_Morph.prototype.destroyShareBox = function() {
    if (this.shareBox) {
        this.shareBox.destroy();
    }

    if (this.shareAssetsBox) {
        this.shareAssetsBox.destroy();
    }

    if (this.shareBoxTitleBarButtons) {
        this.shareBoxTitleBarButtons.destroy();
    }

    if (this.shareBoxTitleBar) {
        this.shareBoxTitleBar.destroy();
    }

    // reset the sharebox ID
    this.shareboxId = "No Group Yet";

    this.createShareBoxConnectBar();
    this.createShareBoxConnect();
    this.createShareBoxTitleBar();
    this.showNewGroupScreen();
    this.fixLayout();
};

IDE_Morph.prototype.createShareAssetsBox = function () {
    // Initialization of ShareAssetsBox and its default behavior
    var myself = this;

    // Destroy if sharebox exists
    if (this.shareAssetsBox) {
        this.shareAssetsBox.destroy();
    }

    // delete the connect morph if sharebox is in operation
    if (this.shareBoxConnect) {
        this.shareBoxConnect.destroy();
    }

    this.shareAssetsBox = new FrameMorph();
    this.shareAssetsBox.color = this.groupColor;
    this.shareAssetsBox.acceptsDrops = true;
    this.add(this.shareAssetsBox);

    this.shareAssetsBox.reactToDropOf = function (droppedMorph) {
        if (droppedMorph instanceof BlockMorph) {
            myself.shareAssetsBox.add(droppedMorph);
        } else {
            droppedMorph.destroy();
        }
    };

    // Executes shareBox prototype functionality. To be modified/deleted thereafter
    // IDE_Morph.makeSocket.call(this, myself);
};

// xinni: ShareBox connection tab bar that just says "Create group"
IDE_Morph.prototype.createShareBoxConnectBar = function () {
    if (this.shareBoxConnectBar) {
        this.shareBoxConnectBar.destroy();
    }

    // destroy the sharebox bar when currently not connected.
    if (this.shareBoxBar) {
        this.shareBoxBar.destroy();
    }

    var
        tabCorner = 15,
        tabColors = this.tabColors,
        tabBar = new AlignmentMorph('row', -tabCorner * 2),
        tab,
        myself = this;


    this.shareBoxConnectBar = new Morph();
    this.shareBoxConnectBar.bounds = new Rectangle(0, 0, 0, 0); // xinni: remove unwanted floating rectangle
    this.shareBoxConnectBar.color = null;
    this.add(this.shareBoxConnectBar);

    // tab bar
    // disable tabTo function for now as not needed
    /*
     tabBar.tabTo = function (tabString) {
     var active;
     myself.currentShareBoxConnectTab = tabString;
     this.children.forEach(function (each) {
     each.refresh();
     if (each.state) {active = each; }
     });
     active.refresh(); // needed when programmatically tabbing
     myself.createShareBoxConnect();
     myself.fixLayout('tabEditor');
     };
     */

    tab = new TabMorph(
        tabColors,
        null, // target
        function () {
            tabBar.tabTo('connect');
        },
        localize('No Group Yet'), // label
        function () {  // query
            return myself.currentShareBoxConnectTab === 'connect';
        }
    );
    tab.padding = 3;
    tab.corner = tabCorner;
    tab.edge = 1;
    tab.labelShadowOffset = new Point(-1, -1);
    tab.labelShadowColor = tabColors[1];
    tab.labelColor = this.buttonLabelColor;
    tab.drawNew();
    tab.fixLayout();
    tabBar.add(tab);

    tabBar.fixLayout();
    tabBar.children.forEach(function (each) {
        each.refresh();
    });
    this.shareBoxConnectBar.tabBar = tabBar;
    this.shareBoxConnectBar.add(this.shareBoxConnectBar.tabBar);

    this.shareBoxConnectBar.fixLayout = function () {
        this.setExtent(new Point(
            this.right() - this.left(),
            this.height()
        ));
        this.tabBar.setLeft(this.left());
        this.tabBar.setBottom(this.bottom() + 75);
    };

};

// xinni: creates and shows ShareBox connection morph
IDE_Morph.prototype.createShareBoxConnect = function () {

    // init variables
    var myself = this;

    // hide sharebox if haven't connected
    if (this.shareBox) {
        this.shareBox.destroy();
    }

    // destroy if already exists
    if (this.shareBoxConnect) {
        this.shareBoxConnect.destroy();
    }

    // show the share box connect bar if it isn't there
    if (!this.shareBoxConnectBar) {
        this.createShareBoxConnectBar();
    }

    // init shareBoxConnect
    this.shareBoxConnect = new ScrollFrameMorph();
    this.shareBoxConnect.color = this.groupColor;
    this.shareBoxConnect.acceptsDrops = false;

    // add to myself
    this.add(this.shareBoxConnect);
};


// xinni: shows sharebox and title bar buttons (settings and add)
IDE_Morph.prototype.showEntireShareBoxComponent = function(isOwner) {

    console.log("showEntireShareBoxComponent triggered.");

    // destroy screens and morphs shown before this.
    if (this.newGroupScreen) {
        this.newGroupScreen.destroy();
    }
    if (this.requestReceivedScreen) {
        this.requestReceivedScreen.destroy();
    }
    if (this.shareBoxConnect) {
        this.shareBoxConnect.destroy();
    }
    if (this.shareBoxConnectBar) {
        this.shareBoxConnectBar.destroy();
    }







    console.log("sharebox about to be created. previous screens destroyed.");
    myself = this;

    if(isOwner){

        // create share box
        // SnapCloud.createSharebox(tempIdentifier, function(data) {
        //     myself.shareboxId = prompt("sharebox id?", data.data[0].id);
        //     console.log("show entire share box");
        //     myself.createShareBoxBar();
        //     // create title bar buttons
        //     myself.createShareBoxTitleBar();
        //     myself.createShareBoxTitleBarButtons();
        //     myself.createShareBox();
            
        //     myself.fixLayout();

        //     var txt = new TextMorph(data.data[0].id.toString());
        //     txt.setColor(SpriteMorph.prototype.paletteTextColor);
        //     txt.setPosition(new Point(5, 5));
        //     txt.show();
        //     myself.shareBox.add(txt);
        // });

        myself.shareboxId = tempIdentifier;

        console.log("show entire share box");
        myself.createShareBoxBar();
        // create title bar buttons
        myself.createShareBoxTitleBar();
        myself.createShareBoxTitleBarButtons();
        myself.createShareBox();
        
        myself.fixLayout();

        var txt = new TextMorph(myself.shareboxId);
        txt.setColor(SpriteMorph.prototype.paletteTextColor);
        txt.setPosition(new Point(5, 5));
        txt.show();
        myself.shareBox.add(txt);

    } else {
        
        console.log("show entire share box");
        myself.createShareBoxBar();
        // create title bar buttons
        myself.createShareBoxTitleBar();
        myself.createShareBoxTitleBarButtons();
        myself.createShareBox();
		
		myself.shareBoxTitleBarButtons.shareBoxAnnoucementButton.destroy();
        
        myself.fixLayout();

        var txt = new TextMorph(myself.shareboxId);
        txt.setColor(SpriteMorph.prototype.paletteTextColor);
        txt.setPosition(new Point(5, 5));
        txt.show();
        myself.shareBox.add(txt);
    }




};



// ********************************
// ShareBox screens and messages
// ********************************

// xinni: Create new group screen
IDE_Morph.prototype.showNewGroupScreen = function() {

    var myself = this;
    var padding = 10;

    // make sure parent is there
    if (!this.shareBoxConnect) {
        this.createShareBoxConnect();
    }

    // *****************************
     // screen 1: CREATE A NEW GROUP
     // *****************************

    // init screen
    if (this.newGroupScreen) {
      this.newGroupScreen.destroy();
    }

    if (this.requestReceivedScreen) {
        this.requestReceivedScreen.destroy();
    }

     this.newGroupScreen = new FrameMorph();
     this.newGroupScreen.color = this.shareBoxConnect.color;
     this.shareBoxConnect.addContents(this.newGroupScreen);

     // screen 1: NEW GROUP logo
     if (this.newGroupLogo) {
        this.newGroupLogo.destroy();
     }
     newGroupLogo = new Morph();
     newGroupLogo.texture = 'images/share.png';
     newGroupLogo.drawNew = function () {
         this.image = newCanvas(this.extent());
         var context = this.image.getContext('2d');
         var picBgColor = myself.shareBoxConnect.color;
         context.fillStyle = picBgColor.toString();
         context.fillRect(0, 0, this.width(), this.height());
         if (this.texture) {
             this.drawTexture(this.texture);
         }
     };

     newGroupLogo.setExtent(new Point(181, 123));
     newGroupLogo.setLeft(this.stage.width() / 2 - newGroupLogo.width() / 2);
     newGroupLogo.setTop(this.stage.height() / 8);
     this.newGroupScreen.add(newGroupLogo);

     // screen 1: NEW SESSION text
     txt = new TextMorph("Start a collaboration session");
     txt.setColor(SpriteMorph.prototype.paletteTextColor);
     txt.setPosition(new Point(this.stage.width() / 2 - txt.width() / 2, newGroupLogo.bottom() + padding));
     this.newGroupScreen.add(txt);

     // screen 1: CREATE NEW GROUP button
     var groupButton = new PushButtonMorph(null, null, "Create a Group", null, null, null, "green");
     groupButton.setPosition(new Point(this.stage.width() / 2 - groupButton.width() / 2, txt.bottom() + padding));
     groupButton.action = function() {
         var result = "success";

         if (result === "success") {
             console.log("Creating a new group and initializing a new session.");
             myself.showEntireShareBoxComponent(true);
             myself.showGroupCreatedSuccessPopup();
         } else {
             console.log("Can't create group.");
             myself.showGroupCreatedFailurePopup();
         }
     }
     this.newGroupScreen.add(groupButton);

     this.shareBoxConnect.drawNew();
     //myself.fixLayout();
}

// xinni: Creates the request received screen.
// i.e. "You have a group invite" message. Show this to the user who is requested!!
IDE_Morph.prototype.showRequestReceivedMessage = function (inviteData) {
    // *****************************
    // screen 3: Request received
    // *****************************

    var myself = this;
    var padding = 10;

    // make sure parent is there
  //  if (!this.shareBoxConnect) {
        this.createShareBoxConnect();
   // }

    // init req received screen
    if (this.requestReceivedScreen) {
        this.requestReceivedScreen.destroy();
    }
    // delete new group screen
    if (this.newGroupScreen) {
        this.newGroupScreen.destroy();
        console.log("new group destroyed");
    }

    this.requestReceivedScreen = new FrameMorph();
    this.requestReceivedScreen.color = this.shareBoxConnect.color;

    // screen 3: Awaiting reply logo
    if (this.requestReceivedLogo) {
        this.requestReceivedLogo.destroy();
    }

    var requestReceivedLogo = new Morph();
    requestReceivedLogo.texture = 'images/notification.png';
    requestReceivedLogo.drawNew = function () {
        this.image = newCanvas(this.extent());
        var context = this.image.getContext('2d');
        var picBgColor = myself.shareBoxConnect.color;
        context.fillStyle = picBgColor.toString();
        context.fillRect(0, 0, this.width(), this.height());
        if (this.texture) {
            this.drawTexture(this.texture);
        }
    };
    requestReceivedLogo.setExtent(new Point(129, 123));
    requestReceivedLogo.setLeft(this.stage.width() / 2 - requestReceivedLogo.width() / 2);
    requestReceivedLogo.setTop(this.stage.width() / 8);
    this.requestReceivedScreen.add(requestReceivedLogo);

    // screen 3: Awaiting reply text
    txt = new TextMorph(inviteData.ownerId  + " would like to invite you to their collaboration group.");

    txt.setColor(SpriteMorph.prototype.paletteTextColor);
    txt.setPosition(new Point(this.stage.width() / 2 - txt.width() / 2, requestReceivedLogo.bottom() + padding));
    this.requestReceivedScreen.add(txt);

    // screen 3: Accept button -> launch sharebox.
    acceptButton = new PushButtonMorph(null, null, "Accept", null, null, null, "green");
    acceptButton.setPosition(new Point(myself.stage.width() / 2 - acceptButton.width() - padding, txt.bottom() + padding));
    acceptButton.action = function () {

        // result of the accepting request
        var result = "success";
        if (result === "success") { // ACCEPT REQUEST SUCCEEDED

            // destroy sharebox morph and show sharebox connect
            console.log("Accept request success. Launch Sharebox.");

            var socketData = {id: tempIdentifier, room: inviteData.room}
            myself.sharer.socket.emit('INVITE_ACCEPT', socketData);
            console.log("[SOCKET-SEND] INVITE_ACCEPT: " + JSON.stringify(socketData))
            myself.shareboxId = socketData.room;

            // change GUI
            myself.showAcceptRequestSuccessPopup();
            myself.showEntireShareBoxComponent(false);

        } else { // ACCEPT REQUEST FAILED

            myself.showAcceptRequestFailurePopup();
            console.log("Accept request failed. Go back to Create group screen.");
            myself.destroyShareBox();
            var socketData = {room: inviteData.room, removeId: tempIdentifier};
            myself.sharer.socket.emit('REMOVE_USER', socketData);
            
            // @yiwen - remove the person from pending members
        }
        
    };
    this.requestReceivedScreen.add(acceptButton);

    // screen 3: Reject button -> go back to create group screen.
    rejectButton = new PushButtonMorph(null, null, "Reject", null, null, null, "red");
    rejectButton.setPosition(new Point(myself.stage.width() / 2 + padding, txt.bottom() + padding));
    rejectButton.action = function () {
        console.log("Reject button pressed. Back to Create group screen.");
        myself.sharer.socket.emit('INVITE_REJECT', {
            id: tempIdentifier,
            room: inviteData.room,
        })
        myself.destroyShareBox();
    };
    this.requestReceivedScreen.add(rejectButton);

    // add to shareBoxConnect
    this.shareBoxConnect.addContents(this.requestReceivedScreen);

    this.shareBoxConnect.drawNew();
    this.requestReceivedScreen.show();
    myself.fixLayout();

};

// xinni: Show this when a sharebox session exists but there are no scripts added yet
IDE_Morph.prototype.showNoScriptsMessage = function () {
    var padding = 10;

    // init morph
    if (this.noScriptsMessage) {
        this.noScriptsMessage.destroy();
    }
    this.noScriptsMessage = new FrameMorph();
    this.noScriptsMessage.color = this.shareBoxConnect.color;

    // add to sharebox
    if (this.shareBox) {
        this.shareBox.addContents(this.noScriptsMessage);
    } else {
        console.log("Tried to call No Scripts message in a non existing sharebox.");
    }


    // "Drag blocks to share script"
    scriptsInstructionsTxt = new TextMorph("Drag block(s) here to share a script.");
    scriptsInstructionsTxt.setColor(SpriteMorph.prototype.paletteTextColor);
    scriptsInstructionsTxt.setPosition(new Point(this.shareBox.width() / 2 - scriptsInstructionsTxt.width() / 2, this.shareBox.top() + padding));
    this.noScriptsMessage.add(scriptsInstructionsTxt);

    // "No scripts here yet :("
    noScriptsYetTxt = new TextMorph("No scripts shared yet :(");
    noScriptsYetTxt.setColor(SpriteMorph.prototype.paletteTextColor);
    noScriptsYetTxt.setPosition(new Point(this.shareBox.width() / 2 - noScriptsYetTxt.width() / 2, this.showNoScriptsMessage.scriptsInstructionsTxt.top() + padding*3));
    this.noScriptsMessage.add(noScriptsYetTxt);


    // show the screen.
    this.noScriptsMessage.show();
};

// xinni: Show this window when not connected to server (this.showShareBoxDisconnectedWindow();)
IDE_Morph.prototype.showShareBoxDisconnectedWindow = function () {
    var padding = 10;

    if (this.shareBoxDisconnectedWindow) {
        this.shareBoxDisconnectedWindow.destroy();
    }

    // disconnected window morph
    this.shareBoxDisconnectedWindow = new ScrollFrameMorph();
    this.shareBoxDisconnectedWindow.color = this.groupColor;
    this.shareBoxDisconnectedWindow.acceptsDrops = false;
    myself = this;
    this.add(this.shareBoxDisconnectedWindow);

    // disconnected logo
    if (this.disconnectedLogo) {
        this.disconnectedLogo.destroy();
    }
    disconnectedLogo = new Morph();
    disconnectedLogo.texture = 'images/error.png';
    disconnectedLogo.drawNew = function () {
        this.image = newCanvas(this.extent());
        var context = this.image.getContext('2d');
        var picBgColor = myself.groupColor;
        context.fillStyle = picBgColor.toString();
        context.fillRect(0, 0, this.width(), this.height());
        if (this.texture) {
            this.drawTexture(this.texture);
        }
    };
    disconnectedLogo.setExtent(new Point(128, 128));
    disconnectedLogo.setLeft(this.stage.width() / 2 - disconnectedLogo.width() / 2);
    disconnectedLogo.setTop(this.stage.height() / 8);
    this.shareBoxDisconnectedWindow.add(disconnectedLogo);

    // disconnected text
    disconnectedTxt = new TextMorph("Unable to connect to server.");
    disconnectedTxt.setColor(SpriteMorph.prototype.paletteTextColor);
    disconnectedTxt.setPosition(new Point(this.stage.width() / 2 - disconnectedTxt.width() / 2, disconnectedLogo.bottom() + padding));
    this.shareBoxDisconnectedWindow.add(disconnectedTxt);


};


// *****************************
// ShareBox popups
// *****************************

// * * * * * * * * * View Members Popup * * * * * * * * * * * * * * * * *

// xinni: Displays a list of group members. Condition: must be in group.
IDE_Morph.prototype.showViewMembersPopup = function() {
    var world = this.world();
    var popupWidth = 500;
    var popupHeight = 400;
    var myself = this;
    var showingToCreator = false;
    var pendingMembers = [];
    var groupMembers = [tempIdentifier];
    var groupMembersIsOnline = [true];


    // ask for members right now
    var socketData = {room:shareboxId}
    this.sharer.socket.emit('GET_MEMBERS', socketData);
    console.log("[SOCKET-SEND] GET_MEMBERS: " + JSON.stringify(socketData));
    
    // TO BE REFRACTORED
    this.sharer.socket.on('UPDATE_MEMBERS', function(data){
        console.log("[SOCKET-RECEIVE] FIRST_UPDATE_MEMBERS: " + JSON.stringify(data));
        pendingMembers = [];
        groupMembers = [tempIdentifier];
        groupMembersIsOnline = [true];
        console.log("ownder info: " + JSON.stringify(data.owner))
        showingToCreator = (data.owner.clientId == tempIdentifier);

        for (var i = data.members.length - 1; i >= 0; i--) {
            if(data.members[i].isPending) {
                pendingMembers.push(data.members[i].clientId);
            } else {
                if(data.members[i].clientId !== tempIdentifier){
                    groupMembers.push(data.members[i].clientId);
                    groupMembersIsOnline.push(true);
                }
            }
            
        };

        // set up the frames to contain the member list "viewMembersPopup" and "membersViewFrame"
        if (myself.viewMembersPopup) {
            myself.viewMembersPopup.destroy();
        }
        myself.viewMembersPopup = new DialogBoxMorph();
        myself.viewMembersPopup.setExtent(new Point(popupWidth, popupHeight));

        if (myself.membersViewFrame) {
            myself.membersViewFrame.destroy();
        }
        myself.membersViewFrame = new ScrollFrameMorph();
        myself.membersViewFrame.setColor(myself.viewMembersPopup.color);
        myself.membersViewFrame.setExtent(new Point(640, 350));
        myself.membersViewFrame.setTop(myself.viewMembersPopup.top() + 30);
        myself.membersViewFrame.setLeft(myself.viewMembersPopup.left());
        myself.membersViewFrame.setWidth(myself.viewMembersPopup.width());
        myself.membersViewFrame.drawNew();
        myself.viewMembersPopup.add(myself.membersViewFrame);

        // list group members
        myself.showGroupMemberTitle(groupMembers.length);
        for (var i = 0; i < groupMembers.length; i++) {
            if (i === 0) { // assumes first member is always the creator
                myself.showMemberRow(true, groupMembersIsOnline[i], groupMembers[i], i + 1, showingToCreator);
            } else { // not creator, is normal member
                myself.showMemberRow(false, groupMembersIsOnline[i], groupMembers[i], i + 1, showingToCreator);
            }
        }

        // list pending group members
        myself.showPendingMemberTitle(pendingMembers.length, groupMembers.length);
        for (var j = 0; j < pendingMembers.length; j++) {
            myself.showMemberRow(false, false, pendingMembers[j], j + groupMembers.length + 2, showingToCreator);
        }


        // add close button
        var button = new PushButtonMorph(null, null, "Close me", null, null, null, "green");
        button.action = function() { 
            myself.sharer.socket.removeAllListeners("UPDATE_MEMBERS");
            myself.viewMembersPopup.cancel(); 
        };
        button.setCenter(myself.viewMembersPopup.center());
        button.setBottom(myself.viewMembersPopup.bottom() - 10);
        myself.viewMembersPopup.add(button);

        // add title
        myself.viewMembersPopup.labelString = "View Sharebox Members";
        myself.viewMembersPopup.createLabel();

        // popup the popup
        myself.viewMembersPopup.drawNew();
        myself.viewMembersPopup.fixLayout();
        myself.viewMembersPopup.popUp(world);
    })
    
};

IDE_Morph.prototype.showGroupMemberTitle = function(numberOfGroupMembers) {
    var titlePadding = 5;
    var titleBarHeight = 30;

    // initialize frame
    if (this.groupMemberTitle) {
        this.groupMemberTitle.destroy();
    }
    this.groupMemberTitle = new FrameMorph();
    this.groupMemberTitle.setColor(this.groupColor.darker(20));

    // initialize title "Group Members (count)"
    if (this.groupMemberTxt) {
        this.groupMemberTxt.destroy();
    }
    this.groupMemberTxt = new StringMorph(
        "Group Members (" + numberOfGroupMembers + ")",
        14,
        'sans-serif',
        true,
        false,
        false,
        null,
        this.frameColor.darker(this.buttonContrast)
    );


    // position title
    this.groupMemberTitle.setLeft(this.membersViewFrame.left() + titlePadding);
    this.groupMemberTitle.setTop(this.membersViewFrame.top() + titlePadding);
    this.groupMemberTitle.setWidth(this.membersViewFrame.width() - titlePadding*2);
    this.groupMemberTitle.setHeight(titleBarHeight);
    this.groupMemberTitle.drawNew();

    // position text
    this.groupMemberTxt.setLeft(this.groupMemberTitle.left() + titlePadding);
    this.groupMemberTxt.setTop(this.groupMemberTitle.top() + titlePadding);
    this.groupMemberTxt.setWidth(400);
    this.groupMemberTxt.drawNew();


    // add title
    this.groupMemberTitle.add(this.groupMemberTxt);
    this.membersViewFrame.add(this.groupMemberTitle);
};

IDE_Morph.prototype.showPendingMemberTitle = function(numberOfPendingMembers, numberOfGroupMembers) {
    var titlePadding = 5;
    var titleBarHeight = 30;

    // initialize frame
    if (this.pendingMemberTitle) {
        this.pendingMemberTitle.destroy();
    }
    this.pendingMemberTitle = new FrameMorph();
    this.pendingMemberTitle.setColor(this.groupColor.darker(20));

    // initialize title "Pending Members (count)"
    if (this.pendingMemberTxt) {
        this.pendingMemberTxt.destroy();
    }
    this.pendingMemberTxt = new StringMorph(
        "Pending Members (" + numberOfPendingMembers + ")",
        14,
        'sans-serif',
        true,
        false,
        false,
        null,
        this.frameColor.darker(this.buttonContrast)
    );

    // position title
    this.pendingMemberTitle.setLeft(this.membersViewFrame.left() + titlePadding);
    this.pendingMemberTitle.setTop(this.groupMemberTitle.bottom() + (numberOfGroupMembers * (groupMemberRow.height() + titlePadding)) + titlePadding);
    this.pendingMemberTitle.setWidth(this.membersViewFrame.width() - titlePadding*2);
    this.pendingMemberTitle.setHeight(titleBarHeight);
    this.pendingMemberTitle.drawNew();

    // position text
    this.pendingMemberTxt.setLeft(this.pendingMemberTitle.left() + titlePadding);
    this.pendingMemberTxt.setTop(this.pendingMemberTitle.top() + titlePadding);
    this.pendingMemberTxt.setWidth(400);
    this.pendingMemberTxt.drawNew();

    // add title
    this.pendingMemberTitle.add(this.pendingMemberTxt);
    this.membersViewFrame.add(this.pendingMemberTitle);
};

// isOnline, username, isLastRow (dont add line separator)
IDE_Morph.prototype.showMemberRow = function(isCreator, isOnline, username, rowNo, showingToCreator) {
    var titlePadding = 5;
    var myself = this;
    console.log("Adding member row for " + username);

    groupMemberRow = new FrameMorph();
    groupMemberRow.setColor(this.membersViewFrame.color);
    groupMemberRow.setHeight(40);
    groupMemberRow.setWidth(this.membersViewFrame.width());

    // show Online green dot
    if (isOnline) {
        onlineDot = new StringMorph(
            "☻",
            14,
            'sans-serif',
            true,
            false,
            false,
            null,
            new Color(60, 158, 0)
        );
        onlineDot.setColor(new Color(60, 158, 0));
        onlineDot.setLeft(myself.membersViewFrame.left() + 10);
        onlineDot.drawNew();
        groupMemberRow.add(onlineDot);
    }

    // show username
    usernameLabel = new StringMorph(
        username,
        14,
        'sans-serif',
        true,
        false,
        false,
        null,
        this.frameColor.darker(this.buttonContrast)
    );
    usernameLabel.setLeft(myself.membersViewFrame.left() + 10 + 40 + 10);
    usernameLabel.drawNew();
    groupMemberRow.add(usernameLabel);

    // show delete button for ordinary members
    if (showingToCreator && (rowNo > 1)) {
        deleteButton = new PushButtonMorph(
            this,
            null,
            (String.fromCharCode("0xf068")),
            null,
            null,
            null,
            "deleteIconButton"
        );
        deleteButton.setRight(myself.membersViewFrame.right() - titlePadding*2);
        deleteButton.action = function() { myself.showRemoveMemberPopup(username); };
        deleteButton.drawNew();
        deleteButton.fixLayout();
        groupMemberRow.add(deleteButton);
    }

    // position and add the row to the frame
    // position title
    groupMemberRow.setLeft(myself.membersViewFrame.left() + titlePadding);
    groupMemberRow.setTop(myself.groupMemberTitle.bottom() + ((rowNo - 1) * (groupMemberRow.height() + titlePadding)) + titlePadding);
    groupMemberRow.setWidth(myself.membersViewFrame.width() - titlePadding*2);
    groupMemberRow.drawNew();
    this.membersViewFrame.add(groupMemberRow);
};

// * * * * * * * * * Create Group Popup * * * * * * * * * * * * * * * * *

IDE_Morph.prototype.showGroupCreatedSuccessPopup = function() {
    var world = this.world();
    var myself = this;
    var popupWidth = 400;
    var popupHeight = 330;

    if (this.createGroupSuccessPopup) {
        this.createGroupSuccessPopup.destroy();
    }
    this.createGroupSuccessPopup = new DialogBoxMorph();
    this.createGroupSuccessPopup.setExtent(new Point(popupWidth, popupHeight));

    // close dialog button
    button = new PushButtonMorph(
        this,
        null,
        (String.fromCharCode("0xf00d")),
        null,
        null,
        null,
        "redCircleIconButton"
    );
    button.setRight(this.createGroupSuccessPopup.right() - 3);
    button.setTop(this.createGroupSuccessPopup.top() + 2);
    button.action = function () { myself.createGroupSuccessPopup.cancel(); };
    button.drawNew();
    button.fixLayout();
    this.createGroupSuccessPopup.add(button);

    // add title
    this.createGroupSuccessPopup.labelString = "Created a group!";
    this.createGroupSuccessPopup.createLabel();

    // success image
    var successImage = new Morph();
    successImage.texture = 'images/success.png';
    successImage.drawNew = function () {
        this.image = newCanvas(this.extent());
        var context = this.image.getContext('2d');
        var picBgColor = myself.createGroupSuccessPopup.color;
        context.fillStyle = picBgColor.toString();
        context.fillRect(0, 0, this.width(), this.height());
        if (this.texture) {
            this.drawTexture(this.texture);
        }
    };

    successImage.setExtent(new Point(128, 128));
    successImage.setCenter(this.createGroupSuccessPopup.center());
    successImage.setTop(this.createGroupSuccessPopup.top() + 40);
    this.createGroupSuccessPopup.add(successImage);

    // success message
    txt = new TextMorph("Woohoo!\nYou're now the creator of " + this.shareboxId + "'s (your) group.\n\nStart adding new members by clicking\nthe ( + ) button.");
    txt.setCenter(this.createGroupSuccessPopup.center());
    txt.setTop(successImage.bottom() + 20);
    this.createGroupSuccessPopup.add(txt);
    txt.drawNew();

    // "got it!" button, closes the dialog.
    okButton = new PushButtonMorph(null, null, "Alright!", null, null, null, "green");
    okButton.setCenter(this.createGroupSuccessPopup.center());
    okButton.setBottom(this.createGroupSuccessPopup.bottom() - 10);
    okButton.action = function() { myself.createGroupSuccessPopup.cancel(); };
    this.createGroupSuccessPopup.add(okButton);

    // popup
    this.createGroupSuccessPopup.drawNew();
    this.createGroupSuccessPopup.fixLayout();
    this.createGroupSuccessPopup.popUp(world);
};

IDE_Morph.prototype.showAnnouncementPopup = function(message) {
    var world = this.world();
    var myself = this;
    var popupWidth = 400;
    var popupHeight = 330;
	
	var answer = confirm("Annoucement: " + message);
	if (answer == true || answer == false) {
		var socketData = {id: tempIdentifier, owner: myself.shareboxId, room:shareboxId }
		myself.sharer.socket.emit('CLOSE_ANNOUNCEMENT', socketData);
	} 
};

IDE_Morph.prototype.showAnnouncementReadPopup = function() {
    var world = this.world();
    var myself = this;
    var popupWidth = 400;
    var popupHeight = 330;

	alert("All members have read the announcement!");
};

IDE_Morph.prototype.showGroupCreatedFailurePopup = function() {
    var world = this.world();
    var myself = this;
    var popupWidth = 400;
    var popupHeight = 300;

    if (this.createGroupFailurePopup) {
        this.createGroupFailurePopup.destroy();
    }
    this.createGroupFailurePopup = new DialogBoxMorph();
    this.createGroupFailurePopup.setExtent(new Point(popupWidth, popupHeight));

    // close dialog button
    button = new PushButtonMorph(
        this,
        null,
        (String.fromCharCode("0xf00d")),
        null,
        null,
        null,
        "redCircleIconButton"
    );
    button.setRight(this.createGroupFailurePopup.right() - 3);
    button.setTop(this.createGroupFailurePopup.top() + 2);
    button.action = function () { myself.createGroupFailurePopup.cancel(); };
    button.drawNew();
    button.fixLayout();
    this.createGroupFailurePopup.add(button);

    // add title
    this.createGroupFailurePopup.labelString = "Could not create group";
    this.createGroupFailurePopup.createLabel();

    // failure image
    var failureImage = new Morph();
    failureImage.texture = 'images/failure.png';
    failureImage.drawNew = function () {
        this.image = newCanvas(this.extent());
        var context = this.image.getContext('2d');
        var picBgColor = myself.createGroupFailurePopup.color;
        context.fillStyle = picBgColor.toString();
        context.fillRect(0, 0, this.width(), this.height());
        if (this.texture) {
            this.drawTexture(this.texture);
        }
    };

    failureImage.setExtent(new Point(128, 128));
    failureImage.setCenter(this.createGroupFailurePopup.center());
    failureImage.setTop(this.createGroupFailurePopup.top() + 40);
    this.createGroupFailurePopup.add(failureImage);

    // failure message
    txt = new TextMorph("Sorry! We couldn't create the group right now.\nPlease try again later.");


    txt.setCenter(this.createGroupFailurePopup.center());
    txt.setTop(failureImage.bottom() + 20);
    this.createGroupFailurePopup.add(txt);
    txt.drawNew();

    // "OK" button, closes the dialog.
    okButton = new PushButtonMorph(null, null, "OK :(", null, null, null, "green");
    okButton.setCenter(this.createGroupFailurePopup.center());
    okButton.setBottom(this.createGroupFailurePopup.bottom() - 10);
    okButton.action = function() { myself.createGroupFailurePopup.cancel(); };
    this.createGroupFailurePopup.add(okButton);

    // popup
    this.createGroupFailurePopup.drawNew();
    this.createGroupFailurePopup.fixLayout();
    this.createGroupFailurePopup.popUp(world);
};

// * * * * * * * * * Add Member Popup * * * * * * * * * * * * * * * * *

// xinni: Popup when creator chooses "Add new Member"
IDE_Morph.prototype.showAddMemberPopup = function() {
    var world = this.world();
    var myself = this;
    var popupWidth = 400;
    var popupHeight = 300;

    if (this.addMemberPopup) {
        this.addMemberPopup.destroy();
    }
    this.addMemberPopup = new DialogBoxMorph();
    this.addMemberPopup.setExtent(new Point(popupWidth, popupHeight));

    // close dialog button
    button = new PushButtonMorph(
        this,
        null,
        (String.fromCharCode("0xf00d")),
        null,
        null,
        null,
        "redCircleIconButton"
    );

    button.setRight(this.addMemberPopup.right() - 3);
    button.setTop(this.addMemberPopup.top() + 2);
    button.action = function () { myself.addMemberPopup.cancel(); };
    button.drawNew();
    button.fixLayout();
    this.addMemberPopup.add(button);

    // the text input box
    var usernameInput = new InputFieldMorph();
    usernameInput.setWidth(200);
    usernameInput.setCenter(myself.addMemberPopup.center());
    usernameInput.fontSize = 15;
    usernameInput.typeInPadding = 4;
    usernameInput.fixLayout();
    usernameInput.drawNew();
    this.addMemberPopup.add(usernameInput);


    // "Add" Button
    addButton = new PushButtonMorph(null, null, "Add this user", null, null, null, "green");
    addButton.setCenter(myself.addMemberPopup.center());
    addButton.setTop(usernameInput.bottom() + 10);
    addButton.action = function () {
        // get the username from the input
        var username = usernameInput.getValue();
        var txtColor = new Color(204, 0, 0);


        if (username.length < 5) {
            // show error message for blank username
            if (this.txt) {
                this.txt.destroy();
            }
            this.txt = new TextMorph("Usernames are at least 5 characters.");
            this.txt.setColor(txtColor);
            this.txt.setCenter(myself.addMemberPopup.center());
            this.txt.setTop(addButton.bottom() + 20);
            myself.addMemberPopup.add(this.txt);
            this.txt.drawNew();
            myself.addMemberPopup.fixLayout();
            myself.addMemberPopup.drawNew();

        } else if (username.length > 20) {

            // show error message for long username
            if (this.txt) {
                this.txt.destroy();
            }
            this.txt = new TextMorph("Usernames can't exceed 20 characters.");
            this.txt.setColor(txtColor);
            this.txt.setCenter(myself.addMemberPopup.center());
            this.txt.setTop(addButton.bottom() + 20);
            myself.addMemberPopup.add(this.txt);
            this.txt.drawNew();
            myself.addMemberPopup.fixLayout();
            myself.addMemberPopup.drawNew();

        } else {
            // add member to pending members, and feedback result to the user (success/fail)
            // this result value is returned from an internal add member function (NOT ADDED YET)
            //var result = "group_full"; // EITHER: success, connection_error, user_offline, user_nonexistent, user_has_group, group_full
            var result = "success"
            if (result === "success") {
                socketData = { room: myself.shareboxId, inviteUser: username};
                myself.sharer.socket.emit('ADD_USER', { room: myself.shareboxId, inviteId: username, ownerId: tempIdentifier});
                console.log("[SOCKET-SEND] ADD_USER: " + JSON.stringify(socketData));
                myself.addMemberPopup.cancel();
                myself.showAddMemberSuccessPopup(username);
            } else { // return result as any of the following:
                myself.showAddMemberFailurePopup(username, result);
            }
        }
    };
    this.addMemberPopup.add(addButton);


    // add title
    this.addMemberPopup.labelString = "Add a member";
    this.addMemberPopup.createLabel();

    // popup
    this.addMemberPopup.drawNew();
    this.addMemberPopup.fixLayout();
    this.addMemberPopup.popUp(world);
};

// notifies the user that new member has been added successfully.
IDE_Morph.prototype.showAddMemberSuccessPopup = function(username) {
    var world = this.world();
    var myself = this;
    var popupWidth = 400;
    var popupHeight = 330;

    if (this.addMemberSuccessPopup) {
        this.addMemberSuccessPopup.destroy();
    }
    if (this.viewMembersPopup) {
        this.viewMembersPopup.destroy();
    }
    this.addMemberSuccessPopup = new DialogBoxMorph();
    this.addMemberSuccessPopup.setExtent(new Point(popupWidth, popupHeight));

    // close dialog button
    button = new PushButtonMorph(
        this,
        null,
        (String.fromCharCode("0xf00d")),
        null,
        null,
        null,
        "redCircleIconButton"
    );
    button.setRight(this.addMemberSuccessPopup.right() - 3);
    button.setTop(this.addMemberSuccessPopup.top() + 2);
    button.action = function () { myself.addMemberSuccessPopup.cancel(); };
    button.drawNew();
    button.fixLayout();
    this.addMemberSuccessPopup.add(button);

    // add title
    this.addMemberSuccessPopup.labelString = username + " added!";
    this.addMemberSuccessPopup.createLabel();

    // success image
    var successImage = new Morph();
    successImage.texture = 'images/success.png';
    successImage.drawNew = function () {
        this.image = newCanvas(this.extent());
        var context = this.image.getContext('2d');
        var picBgColor = myself.addMemberSuccessPopup.color;
        context.fillStyle = picBgColor.toString();
        context.fillRect(0, 0, this.width(), this.height());
        if (this.texture) {
            this.drawTexture(this.texture);
        }
    };

    successImage.setExtent(new Point(128, 128));
    successImage.setCenter(this.addMemberSuccessPopup.center());
    successImage.setTop(this.addMemberSuccessPopup.top() + 40);
    this.addMemberSuccessPopup.add(successImage);

    // success message
    txt = new TextMorph("You've sent " + username + " a group invite. \n\n" + username + " has been added as a Pending Member, \nand will become a group member once the\ninvite is accepted.");
    txt.setCenter(this.addMemberSuccessPopup.center());
    txt.setTop(successImage.bottom() + 20);
    this.addMemberSuccessPopup.add(txt);
    txt.drawNew();

    // "got it!" button, closes the dialog.
    okButton = new PushButtonMorph(null, null, "Got it!", null, null, null, "green");
    okButton.setCenter(this.addMemberSuccessPopup.center());
    okButton.setBottom(this.addMemberSuccessPopup.bottom() - 10);
    okButton.action = function() { myself.addMemberSuccessPopup.cancel(); };
    this.addMemberSuccessPopup.add(okButton);

    // popup
    this.addMemberSuccessPopup.drawNew();
    this.addMemberSuccessPopup.fixLayout();
    this.addMemberSuccessPopup.popUp(world);

};

// causes of error: connection_error, user_offline, user_nonexistent, user_has_group, group_full
IDE_Morph.prototype.showAddMemberFailurePopup = function(username, errorCause) {
    var world = this.world();
    var myself = this;
    var popupWidth = 400;
    var popupHeight = 300;

    if (this.addMemberFailurePopup) {
        this.addMemberFailurePopup.destroy();
    }
    this.addMemberFailurePopup = new DialogBoxMorph();
    this.addMemberFailurePopup.setExtent(new Point(popupWidth, popupHeight));

    // close dialog button
    button = new PushButtonMorph(
        this,
        null,
        (String.fromCharCode("0xf00d")),
        null,
        null,
        null,
        "redCircleIconButton"
    );
    button.setRight(this.addMemberFailurePopup.right() - 3);
    button.setTop(this.addMemberFailurePopup.top() + 2);
    button.action = function () { myself.addMemberFailurePopup.cancel(); };
    button.drawNew();
    button.fixLayout();
    this.addMemberFailurePopup.add(button);

    // add title
    this.addMemberFailurePopup.labelString = "Failed to add " + username;
    this.addMemberFailurePopup.createLabel();

    // failure image
    var failureImage = new Morph();
    failureImage.texture = 'images/failure.png';
    failureImage.drawNew = function () {
        this.image = newCanvas(this.extent());
        var context = this.image.getContext('2d');
        var picBgColor = myself.addMemberFailurePopup.color;
        context.fillStyle = picBgColor.toString();
        context.fillRect(0, 0, this.width(), this.height());
        if (this.texture) {
            this.drawTexture(this.texture);
        }
    };

    failureImage.setExtent(new Point(128, 128));
    failureImage.setCenter(this.addMemberFailurePopup.center());
    failureImage.setTop(this.addMemberFailurePopup.top() + 40);
    this.addMemberFailurePopup.add(failureImage);

    // failure message
    if (errorCause === "connection_error") {
        txt = new TextMorph("Failed to add " + username + " due to a connection error.\nPlease try again later.");
    } else if (errorCause === "user_offline") {
        txt = new TextMorph("Sorry, " + username + " is offline right now.\nPlease trying adding them later.");
    } else if (errorCause === "user_nonexistent") {
        txt = new TextMorph("Failed to add " + username + ".\nThis user does not exist.");
    } else if (errorCause === "user_has_group") {
        txt = new TextMorph("Sorry, " + username + " is already in a group.");
    } else if (errorCause === "group_full") {
        txt = new TextMorph("Your group is full (5 members).\nNew members can't be added right now.");
    } else {
        txt = new TextMorph(username + " could not be added for unknown reasons.");
    }

    txt.setCenter(this.addMemberFailurePopup.center());
    txt.setTop(failureImage.bottom() + 20);
    this.addMemberFailurePopup.add(txt);
    txt.drawNew();

    // "OK" button, closes the dialog.
    okButton = new PushButtonMorph(null, null, "OK :(", null, null, null, "green");
    okButton.setCenter(this.addMemberFailurePopup.center());
    okButton.setBottom(this.addMemberFailurePopup.bottom() - 10);
    okButton.action = function() { myself.addMemberFailurePopup.cancel(); };
    this.addMemberFailurePopup.add(okButton);

    // popup
    this.addMemberFailurePopup.drawNew();
    this.addMemberFailurePopup.fixLayout();
    this.addMemberFailurePopup.popUp(world);
};

// * * * * * * * * * Accept request Popup * * * * * * * * * * * * * * * * *

IDE_Morph.prototype.showAcceptRequestSuccessPopup = function() {
    var world = this.world();
    var myself = this;
    var popupWidth = 400;
    var popupHeight = 330;

    if (this.acceptRequestSuccessPopup) {
        this.acceptRequestSuccessPopup.destroy();
    }
    this.acceptRequestSuccessPopup = new DialogBoxMorph();
    this.acceptRequestSuccessPopup.setExtent(new Point(popupWidth, popupHeight));

    // close dialog button
    button = new PushButtonMorph(
        this,
        null,
        (String.fromCharCode("0xf00d")),
        null,
        null,
        null,
        "redCircleIconButton"
    );
    button.setRight(this.acceptRequestSuccessPopup.right() - 3);
    button.setTop(this.acceptRequestSuccessPopup.top() + 2);
    button.action = function () { myself.acceptRequestSuccessPopup.cancel(); };
    button.drawNew();
    button.fixLayout();
    this.acceptRequestSuccessPopup.add(button);

    // add title
    this.acceptRequestSuccessPopup.labelString = "You got a new group!";
    this.acceptRequestSuccessPopup.createLabel();

    // success image
    var successImage = new Morph();
    successImage.texture = 'images/success.png';
    successImage.drawNew = function () {
        this.image = newCanvas(this.extent());
        var context = this.image.getContext('2d');
        var picBgColor = myself.acceptRequestSuccessPopup.color;
        context.fillStyle = picBgColor.toString();
        context.fillRect(0, 0, this.width(), this.height());
        if (this.texture) {
            this.drawTexture(this.texture);
        }
    };

    successImage.setExtent(new Point(128, 128));
    successImage.setCenter(this.acceptRequestSuccessPopup.center());
    successImage.setTop(this.acceptRequestSuccessPopup.top() + 40);
    this.acceptRequestSuccessPopup.add(successImage);

    // success message
    txt = new TextMorph("Hooray!\nYou're now a member of the " + this.shareboxId + " group.\n\nStart sharing scripts and costumes by\ndragging them into the Sharebox.");
    txt.setCenter(this.acceptRequestSuccessPopup.center());
    txt.setTop(successImage.bottom() + 20);
    this.acceptRequestSuccessPopup.add(txt);
    txt.drawNew();

    // "got it!" button, closes the dialog.
    okButton = new PushButtonMorph(null, null, "Alright!", null, null, null, "green");
    okButton.setCenter(this.acceptRequestSuccessPopup.center());
    okButton.setBottom(this.acceptRequestSuccessPopup.bottom() - 10);
    okButton.action = function() { myself.acceptRequestSuccessPopup.cancel(); };
    this.acceptRequestSuccessPopup.add(okButton);

    // popup
    this.acceptRequestSuccessPopup.drawNew();
    this.acceptRequestSuccessPopup.fixLayout();
    this.acceptRequestSuccessPopup.popUp(world);

};

// Show this when user try to accept a request but has DC'ed or the group no longer exists.
IDE_Morph.prototype.showAcceptRequestFailurePopup = function() {
    var world = this.world();
    var myself = this;
    var popupWidth = 400;
    var popupHeight = 300;

    if (this.acceptRequestFailurePopup) {
        this.acceptRequestFailurePopup.destroy();
    }
    this.acceptRequestFailurePopup = new DialogBoxMorph();
    this.acceptRequestFailurePopup.setExtent(new Point(popupWidth, popupHeight));

    // close dialog button
    button = new PushButtonMorph(
        this,
        null,
        (String.fromCharCode("0xf00d")),
        null,
        null,
        null,
        "redCircleIconButton"
    );
    button.setRight(this.acceptRequestFailurePopup.right() - 3);
    button.setTop(this.acceptRequestFailurePopup.top() + 2);
    button.action = function () { myself.acceptRequestFailurePopup.cancel(); };
    button.drawNew();
    button.fixLayout();
    this.acceptRequestFailurePopup.add(button);

    // add title
    this.acceptRequestFailurePopup.labelString = "Could not join group";
    this.acceptRequestFailurePopup.createLabel();

    // failure image
    var failureImage = new Morph();
    failureImage.texture = 'images/failure.png';
    failureImage.drawNew = function () {
        this.image = newCanvas(this.extent());
        var context = this.image.getContext('2d');
        var picBgColor = myself.acceptRequestFailurePopup.color;
        context.fillStyle = picBgColor.toString();
        context.fillRect(0, 0, this.width(), this.height());
        if (this.texture) {
            this.drawTexture(this.texture);
        }
    };

    failureImage.setExtent(new Point(128, 128));
    failureImage.setCenter(this.acceptRequestFailurePopup.center());
    failureImage.setTop(this.acceptRequestFailurePopup.top() + 40);
    this.acceptRequestFailurePopup.add(failureImage);

    // failure message
    txt = new TextMorph("Sorry! Accepting this collaboration request has failed.\nPlease try again later.");


    txt.setCenter(this.acceptRequestFailurePopup.center());
    txt.setTop(failureImage.bottom() + 20);
    this.acceptRequestFailurePopup.add(txt);
    txt.drawNew();

    // "OK" button, closes the dialog.
    okButton = new PushButtonMorph(null, null, "OK :(", null, null, null, "green");
    okButton.setCenter(this.acceptRequestFailurePopup.center());
    okButton.setBottom(this.acceptRequestFailurePopup.bottom() - 10);
    okButton.action = function() { myself.acceptRequestFailurePopup.cancel(); };
    this.acceptRequestFailurePopup.add(okButton);

    // popup
    this.acceptRequestFailurePopup.drawNew();
    this.acceptRequestFailurePopup.fixLayout();
    this.acceptRequestFailurePopup.popUp(world);
};

// * * * * * * * * * Leave group Popup * * * * * * * * * * * * * * * * *

// xinni: Popup when user chooses "Leave group"
IDE_Morph.prototype.showLeaveGroupPopup = function() {
    var world = this.world();
    var myself = this;
    var popupWidth = 400;
    var popupHeight = 300;

    if (this.leaveGroupPopup) {
        this.leaveGroupPopup.destroy();
    }
    this.leaveGroupPopup = new DialogBoxMorph();
    this.leaveGroupPopup.setExtent(new Point(popupWidth, popupHeight));

    // close dialog button
    button = new PushButtonMorph(
        this,
        null,
        (String.fromCharCode("0xf00d")),
        null,
        null,
        null,
        "redCircleIconButton"
    );
    button.setRight(this.leaveGroupPopup.right() - 3);
    button.setTop(this.leaveGroupPopup.top() + 2);
    button.action = function () { myself.leaveGroupPopup.cancel(); };
    button.drawNew();
    button.fixLayout();
    this.leaveGroupPopup.add(button);

    // add title
    this.leaveGroupPopup.labelString = "Leave this group?";
    this.leaveGroupPopup.createLabel();

    // leave group image
    var leaveGroupImage = new Morph();
    leaveGroupImage.texture = 'images/error.png';
    leaveGroupImage.drawNew = function () {
        this.image = newCanvas(this.extent());
        var context = this.image.getContext('2d');
        var picBgColor = myself.leaveGroupPopup.color;
        context.fillStyle = picBgColor.toString();
        context.fillRect(0, 0, this.width(), this.height());
        if (this.texture) {
            this.drawTexture(this.texture);
        }
    };

    leaveGroupImage.setExtent(new Point(128, 128));
    leaveGroupImage.setCenter(this.leaveGroupPopup.center());
    leaveGroupImage.setTop(this.leaveGroupPopup.top() + 40);
    this.leaveGroupPopup.add(leaveGroupImage);

    // leave group text
    txt = new TextMorph("You're about to leave your Sharebox Group.\n Press OK to continue.")
    txt.setCenter(this.leaveGroupPopup.center());
    txt.setTop(leaveGroupImage.bottom() + 20);
    this.leaveGroupPopup.add(txt);
    txt.drawNew();

    // OK -> close sharebox and go back to Sharebox Connect
    confirmButton = new PushButtonMorph(null, null, "OK", null, null, null, "green");
    confirmButton.setWidth(120);
    confirmButton.action = function () {
        // call a function here that lets member leave group. return success/failure value.
        // IF A CREATOR LEAVES, THE ENTIRE SHAREBOX SESSION IS TERMINATED.
        var socketData = {id: tempIdentifier, room: myself.shareboxId}
        myself.sharer.socket.emit('LEAVE_SHAREBOX', socketData);
        console.log("[SOCKET-SEND] LEAVE_SHAREBOX: " + JSON.stringify(socketData));

        //var result = "failure"; // DUMMY VALUE FOR NOW. Can be success failure.
        var result = "success";
        if (result === "success") {
            // destroy sharebox morph and show sharebox connect
            myself.destroyShareBox();
            myself.leaveGroupPopup.cancel();
        } else {
            myself.showLeaveGroupFailurePopup();
        }
    };
    // Cancel -> close the dialog.
    rejectButton = new PushButtonMorph(null, null, "Cancel", null, null, null, "red");
    rejectButton.setWidth(120);
    rejectButton.action = function () {
        myself.leaveGroupPopup.cancel();
    };

    // position and add the OK and cancel buttons
    confirmButton.setTop(txt.bottom() + 20);
    rejectButton.setTop(txt.bottom() + 20);
    confirmButton.setLeft(this.leaveGroupPopup.left() + 65);
    rejectButton.setLeft(confirmButton.right() + 30);
    confirmButton.label.setCenter(confirmButton.center());
    rejectButton.label.setCenter(rejectButton.center());
    this.leaveGroupPopup.add(confirmButton);
    this.leaveGroupPopup.add(rejectButton);

    // popup
    this.leaveGroupPopup.drawNew();
    this.leaveGroupPopup.fixLayout();
    this.leaveGroupPopup.popUp(world);
};

IDE_Morph.prototype.showLeaveGroupFailurePopup = function() {
    var world = this.world();
    var myself = this;
    var popupWidth = 400;
    var popupHeight = 300;

    if (this.leaveGroupFailurePopup) {
        this.leaveGroupFailurePopup.destroy();
    }
    this.leaveGroupFailurePopup = new DialogBoxMorph();
    this.leaveGroupFailurePopup.setExtent(new Point(popupWidth, popupHeight));

    // close dialog button
    button = new PushButtonMorph(
        this,
        null,
        (String.fromCharCode("0xf00d")),
        null,
        null,
        null,
        "redCircleIconButton"
    );
    button.setRight(this.leaveGroupFailurePopup.right() - 3);
    button.setTop(this.leaveGroupFailurePopup.top() + 2);
    button.action = function () { myself.leaveGroupFailurePopup.cancel(); };
    button.drawNew();
    button.fixLayout();
    this.leaveGroupFailurePopup.add(button);

    // add title
    this.leaveGroupFailurePopup.labelString = "Error leaving group";
    this.leaveGroupFailurePopup.createLabel();

    // failure image
    var failureImage = new Morph();
    failureImage.texture = 'images/failure.png';
    failureImage.drawNew = function () {
        this.image = newCanvas(this.extent());
        var context = this.image.getContext('2d');
        var picBgColor = myself.leaveGroupFailurePopup.color;
        context.fillStyle = picBgColor.toString();
        context.fillRect(0, 0, this.width(), this.height());
        if (this.texture) {
            this.drawTexture(this.texture);
        }
    };

    failureImage.setExtent(new Point(128, 128));
    failureImage.setCenter(this.leaveGroupFailurePopup.center());
    failureImage.setTop(this.leaveGroupFailurePopup.top() + 40);
    this.leaveGroupFailurePopup.add(failureImage);

    // failure message

    txt = new TextMorph("Sorry! We failed to remove you from the group.\nThis could be due to a connection error.\nPlease try again.");
    txt.setCenter(this.leaveGroupFailurePopup.center());
    txt.setTop(failureImage.bottom() + 20);
    this.leaveGroupFailurePopup.add(txt);
    txt.drawNew();

    // "OK" button, closes the dialog.
    okButton = new PushButtonMorph(null, null, "OK :(", null, null, null, "green");
    okButton.setCenter(this.leaveGroupFailurePopup.center());
    okButton.setBottom(this.leaveGroupFailurePopup.bottom() - 10);
    okButton.action = function() { myself.leaveGroupFailurePopup.cancel(); };
    this.leaveGroupFailurePopup.add(okButton);

    // popup
    this.leaveGroupFailurePopup.drawNew();
    this.leaveGroupFailurePopup.fixLayout();
    this.leaveGroupFailurePopup.popUp(world);
};


// * * * * * * * * * Inform Removed Member Popup * * * * * * * * * * * * * * * * *

// xinni: Popup to user, when creator kicks the user out of the group
IDE_Morph.prototype.showYouHaveBeenRemovedPopup = function() {
    var world = this.world();
    var myself = this;
    var popupWidth = 400;
    var popupHeight = 300;

    if (this.youHaveBeenRemovedPopup) {
        this.youHaveBeenRemovedPopup.destroy();
    }
    this.youHaveBeenRemovedPopup = new DialogBoxMorph();
    this.youHaveBeenRemovedPopup.setExtent(new Point(popupWidth, popupHeight));

    // close dialog button
    button = new PushButtonMorph(
        this,
        null,
        (String.fromCharCode("0xf00d")),
        null,
        null,
        null,
        "redCircleIconButton"
    );
    button.setRight(this.youHaveBeenRemovedPopup.right() - 3);
    button.setTop(this.youHaveBeenRemovedPopup.top() + 2);
    button.action = function () { myself.youHaveBeenRemovedPopup.cancel(); };
    button.drawNew();
    button.fixLayout();
    this.youHaveBeenRemovedPopup.add(button);

    // add title
    this.youHaveBeenRemovedPopup.labelString = "Oops!";
    this.youHaveBeenRemovedPopup.createLabel();

    // failure image
    var failureImage = new Morph();
    failureImage.texture = 'images/error.png';
    failureImage.drawNew = function () {
        this.image = newCanvas(this.extent());
        var context = this.image.getContext('2d');
        var picBgColor = myself.youHaveBeenRemovedPopup.color;
        context.fillStyle = picBgColor.toString();
        context.fillRect(0, 0, this.width(), this.height());
        if (this.texture) {
            this.drawTexture(this.texture);
        }
    };

    failureImage.setExtent(new Point(128, 128));
    failureImage.setCenter(this.youHaveBeenRemovedPopup.center());
    failureImage.setTop(this.youHaveBeenRemovedPopup.top() + 40);
    this.youHaveBeenRemovedPopup.add(failureImage);

    // You were removed message
    txt = new TextMorph("You have been removed from your Sharebox group.\nWe will bring you back to the connection screen shortly.");
    txt.setCenter(this.youHaveBeenRemovedPopup.center());
    txt.setTop(failureImage.bottom() + 20);
    this.youHaveBeenRemovedPopup.add(txt);
    txt.drawNew();

    // "OK" button, closes the dialog.
    okButton = new PushButtonMorph(null, null, "Alrighty", null, null, null, "green");
    okButton.setCenter(this.youHaveBeenRemovedPopup.center());
    okButton.setBottom(this.youHaveBeenRemovedPopup.bottom() - 20);
    okButton.action = function() { myself.youHaveBeenRemovedPopup.cancel(); myself.destroyShareBox(); };
    this.youHaveBeenRemovedPopup.add(okButton);

    // popup
    this.youHaveBeenRemovedPopup.drawNew();
    this.youHaveBeenRemovedPopup.fixLayout();
    this.youHaveBeenRemovedPopup.popUp(world);
};


// * * * * * * * * * Remove a Member Popup * * * * * * * * * * * * * * * * *

// xinni: Popup to creator, when they try to remove a member
IDE_Morph.prototype.showRemoveMemberPopup = function(username) {
    var world = this.world();
    var myself = this;
    var popupWidth = 500;
    var popupHeight = 400;

    if (this.removeMemberPopup) {
        this.removeMemberPopup.destroy();
    }
    this.removeMemberPopup = new DialogBoxMorph();
    this.removeMemberPopup.setExtent(new Point(popupWidth, popupHeight));

    // close dialog button
    button = new PushButtonMorph(
        this,
        null,
        (String.fromCharCode("0xf00d")),
        null,
        null,
        null,
        "redCircleIconButton"
    );
    button.setRight(this.removeMemberPopup.right() - 3);
    button.setTop(this.removeMemberPopup.top() + 2);
    button.action = function () { myself.removeMemberPopup.cancel(); };
    button.drawNew();
    button.fixLayout();
    this.removeMemberPopup.add(button);

    // add title
    this.removeMemberPopup.labelString = "Remove " + username + " from group";
    this.removeMemberPopup.createLabel();

    // leave group image
    var removeMemberImage = new Morph();
    removeMemberImage.texture = 'images/removed.png';
    removeMemberImage.drawNew = function () {
        this.image = newCanvas(this.extent());
        var context = this.image.getContext('2d');
        var picBgColor = myself.removeMemberPopup.color;
        context.fillStyle = picBgColor.toString();
        context.fillRect(0, 0, this.width(), this.height());
        if (this.texture) {
            this.drawTexture(this.texture);
        }
    };

    removeMemberImage.setExtent(new Point(128, 128));
    removeMemberImage.setCenter(this.removeMemberPopup.center());
    removeMemberImage.setTop(this.removeMemberPopup.top() + 90);
    this.removeMemberPopup.add(removeMemberImage);

    // leave group text
    txt = new TextMorph("You're about to remove " + username + " from your group.\nPress OK to continue.")
    txt.setCenter(this.removeMemberPopup.center());
    txt.setTop(removeMemberImage.bottom() + 20);
    this.removeMemberPopup.add(txt);
    txt.drawNew();

    // OK -> close sharebox and go back to Sharebox Connect
    confirmButton = new PushButtonMorph(null, null, "OK", null, null, null, "green");
    confirmButton.setWidth(120);
    confirmButton.action = function () {
        // call a function here that lets creator delete the member. return success/failure value.
        var result = "success"; // DUMMY VALUE FOR NOW. Can be success || failure.

        if (result === "success") {
            var socketData = {room: myself.shareboxId, removeId: username}
            myself.sharer.socket.emit('REMOVE_USER', socketData);
            console.log("[SOCKET-SEND] REMOVE_USER: " + JSON.stringify(socketData));
            myself.removeMemberPopup.cancel();
            if (myself.viewMembersPopup) {
                myself.viewMembersPopup.destroy();
            }
            myself.showViewMembersPopup();
        } else {
            myself.showRemoveMemberFailurePopup(username);
        }
    };
    // Cancel -> close the dialog.
    rejectButton = new PushButtonMorph(null, null, "Cancel", null, null, null, "red");
    rejectButton.setWidth(120);
    rejectButton.action = function () {
        myself.removeMemberPopup.cancel();
    };

    // position and add the OK and cancel buttons
    confirmButton.setTop(txt.bottom() + 20);
    rejectButton.setTop(txt.bottom() + 20);
    confirmButton.setLeft(this.removeMemberPopup.left() + 115);
    rejectButton.setLeft(confirmButton.right() + 30);
    confirmButton.label.setCenter(confirmButton.center());
    rejectButton.label.setCenter(rejectButton.center());
    this.removeMemberPopup.add(confirmButton);
    this.removeMemberPopup.add(rejectButton);

    // popup
    this.removeMemberPopup.drawNew();
    this.removeMemberPopup.fixLayout();
    this.removeMemberPopup.popUp(world);

};

IDE_Morph.prototype.showRemoveMemberFailurePopup = function(username) {
    var world = this.world();
    var myself = this;
    var popupWidth = 500;
    var popupHeight = 400;

    if (this.removeMemberFailurePopup) {
        this.removeMemberFailurePopup.destroy();
    }
    this.removeMemberFailurePopup = new DialogBoxMorph();
    this.removeMemberFailurePopup.setExtent(new Point(popupWidth, popupHeight));

    // close dialog button
    button = new PushButtonMorph(
        this,
        null,
        (String.fromCharCode("0xf00d")),
        null,
        null,
        null,
        "redCircleIconButton"
    );
    button.setRight(this.removeMemberFailurePopup.right() - 3);
    button.setTop(this.removeMemberFailurePopup.top() + 2);
    button.action = function () { myself.removeMemberFailurePopup.cancel(); };
    button.drawNew();
    button.fixLayout();
    this.removeMemberFailurePopup.add(button);

    // add title
    this.removeMemberFailurePopup.labelString = "Failed to remove " + username;
    this.removeMemberFailurePopup.createLabel();

    // failure image
    var failureImage = new Morph();
    failureImage.texture = 'images/failure.png';
    failureImage.drawNew = function () {
        this.image = newCanvas(this.extent());
        var context = this.image.getContext('2d');
        var picBgColor = myself.removeMemberFailurePopup.color;
        context.fillStyle = picBgColor.toString();
        context.fillRect(0, 0, this.width(), this.height());
        if (this.texture) {
            this.drawTexture(this.texture);
        }
    };

    failureImage.setExtent(new Point(128, 128));
    failureImage.setCenter(this.removeMemberFailurePopup.center());
    failureImage.setTop(this.removeMemberFailurePopup.top() + 90);
    this.removeMemberFailurePopup.add(failureImage);

    // failure message

    txt = new TextMorph("Failed to remove " + username + " due to a connection error.\nPlease try again later.");
    txt.setCenter(this.removeMemberFailurePopup.center());
    txt.setTop(failureImage.bottom() + 20);
    this.removeMemberFailurePopup.add(txt);
    txt.drawNew();

    // "OK" button, closes the dialog.
    okButton = new PushButtonMorph(null, null, "OK :(", null, null, null, "green");
    okButton.setCenter(this.removeMemberFailurePopup.center());
    okButton.setTop(txt.bottom() + 20);
    okButton.action = function() { myself.removeMemberFailurePopup.cancel(); };
    this.removeMemberFailurePopup.add(okButton);

    // popup
    this.removeMemberFailurePopup.drawNew();
    this.removeMemberFailurePopup.fixLayout();
    this.removeMemberFailurePopup.popUp(world);
};


// ****************************
// LIBRARY
// ****************************

IDE_Morph.prototype.openLibrary = function () {
	
    if (this.library) {
        this.library.destroy();
    }

    this.library = new DialogBoxMorph();
    var myself = this;
	
	//console.log();
    // style library
	if(myself.refreshPage === 0){
		this.library.setWidth(screen.width * 0.0);
		this.library.setHeight(screen.height * 0.0);
	}else{
		this.library.setWidth(screen.width * 0.6);
		this.library.setHeight(screen.height * 0.7);
	}
    // draw library window contents
    this.createCheckBox();
    this.createImage();

    // close dialog button
    button = new PushButtonMorph(
        this,
        null,
        (String.fromCharCode("0xf00d")),
        null,
        null,
        null,
        "redCircleIconButton"
    );
    button.setRight(this.library.right() - 3);
    button.setTop(this.library.top() + 2);
    button.action = function () { myself.library.cancel(); };
    button.drawNew();
    button.fixLayout();
    this.library.add(button);

    this.library.drawNew();
    this.library.fixLayout();
    this.library.popUp(world);
	//this.library.drawNew();
    myself.add(this.library);
	//if(myself.refreshPage === 0){
	//	this.goNextPage();
	//	this.goPrevPage();
	//}
};


IDE_Morph.prototype.createCheckBox = function() {
    var padding = 10;
    var checkBoxRowHeight = 25;
    var myself = this;
    var mine = this.library;

    this.library.labelString = 'Sprite Library';
    this.library.createLabel();

    var text = new TextMorph("Category");
    text.setFontSize(20);
    text.setPosition(new Point(screen.width * 0.02, screen.height * 0.07));
    this.library.add(text);

    var peoplebox = new ToggleMorph(
        'checkbox',
        null,
        function () {
            myself.tag1people = !myself.tag1people;
            myself.currentPage = 1;
            myself.openLibrary();
            mine.destroy();
        },
        localize('People'),
        function () {
            //console.log(myself.tag1people);
            return myself.tag1people;
        }
    );

    peoplebox.setPosition(new Point(text.left(), text.bottom() + padding));
    this.library.add(peoplebox);

    var animalbox = new ToggleMorph(
        'checkbox',
        null,
        function () {
            myself.tag1animal = !myself.tag1animal;
            myself.currentPage = 1;
            myself.openLibrary();
            mine.destroy();

        },
        localize('Animal'),
        function () {
            return myself.tag1animal;
        }
    );

    animalbox.setPosition(new Point(text.left(), text.bottom() + padding + checkBoxRowHeight));
    this.library.add(animalbox);

    var objectbox = new ToggleMorph(
        'checkbox',
        null,
        function () {
            myself.tag1object = !myself.tag1object;
            myself.currentPage = 1;
            myself.openLibrary();
            mine.destroy();
        },
        localize('Object'),
        function () {
            return myself.tag1object;
        }
    );

    objectbox.setPosition(new Point(text.left(), text.bottom() + padding + checkBoxRowHeight*2));
    this.library.add(objectbox);

    nextFilterLocation = objectbox.bottom() + padding*5;

    var text2 = new TextMorph("Location");
    //this.fontSize = 10;
    text2.setPosition(new Point(text.left(), nextFilterLocation));
    text2.setFontSize(20);
    this.library.add(text2);

    var singaporebox = new ToggleMorph(
        'checkbox',
        null,
        function () {
            myself.tag2singapore = !myself.tag2singapore;
			myself.currentPage = 1;
            myself.openLibrary();
            mine.destroy();
        },
        localize('Singapore'),
        function () {
            return myself.tag2singapore;
        }
    );

    singaporebox.setPosition(new Point(text.left(), text2.bottom() + padding));
    this.library.add(singaporebox);

    var otherbox = new ToggleMorph(
        'checkbox',
        null,
        function () {
            myself.tag2other = !myself.tag2other;
			myself.currentPage = 1;
            myself.openLibrary();
            mine.destroy();
        },
        localize('Others'),
        function () {
            return myself.tag2other;
        }
    );

    otherbox.setPosition(new Point(text.left(), text2.bottom() + padding + checkBoxRowHeight*4));
    this.library.add(otherbox);

    var chinabox = new ToggleMorph(
        'checkbox',
        null,
        function () {
            myself.tag2china = !myself.tag2china;
			myself.currentPage = 1;
            myself.openLibrary();
            mine.destroy();
        },
        localize('China'),
        function () {
            return myself.tag2china;
        }
    );

    chinabox.setPosition(new Point(text.left(), text2.bottom() + padding + checkBoxRowHeight*1));
    this.library.add(chinabox);

    var indiabox = new ToggleMorph(
        'checkbox',
        null,
        function () {
            myself.tag2india = !myself.tag2india;
			myself.currentPage = 1;
            myself.openLibrary();
            mine.destroy();
        },
        localize('India'),
        function () {
            return myself.tag2india;
        }
    );

    indiabox.setPosition(new Point(text.left(), text2.bottom() + padding + checkBoxRowHeight*2));
    this.library.add(indiabox);

    var japanbox = new ToggleMorph(
        'checkbox',
        null,
        function () {
            myself.tag2japan = !myself.tag2japan;
			myself.currentPage = 1;
            myself.openLibrary();
            mine.destroy();
        },
        localize('Japan'),
        function () {
            return myself.tag2japan;
        }
    );

    japanbox.setPosition(new Point(text.left(), text2.bottom() + padding + checkBoxRowHeight*3));
    this.library.add(japanbox);


};


IDE_Morph.prototype.createImage = function() {

    spriteCreator = function() { return new SpriteMorph(new Image()); };
    var spacelength = /*screen.width * 0.3*/ this.library.width() * 0.2;
    var spaceheight = /*screen.height * 0.15*/ this.library.height() * 0.09;
    var myself = this;
    var sprite = new SpriteMorph(new Image());
    var spriteonepage = 15;
    var mine = this.library;

    //------------------------------------------
    var dir = 'api/library/costumes',
        names = myself.getCostumesList(dir),
        i = 0;
    var minIndex = (myself.currentPage - 1) * spriteonepage;
    var maxIndex = (myself.currentPage * spriteonepage) - 1;
	var thumbSize = new Point(60, 60);

    function loadCostume(name) {
        //var url = dir + '/' + name,
        var url = name,
            img = new Image();
        img.onload = function () {
            var canvas = newCanvas(new Point(img.width, img.height));
            canvas.getContext('2d').drawImage(img, 0, 0);
            myself.droppedImage(canvas, name);
        };
        img.src = url;
    }

    //debugger;
    names.forEach(function (line) {
        sprite = spriteCreator();

        //var imagetoshow = new Image();
        var imagetoshow = new Image();
		
		imagetoshow.onload = function () {
            var canvas = newCanvas(new Point(imagetoshow.width, imagetoshow.height));
            canvas.getContext('2d').drawImage(imagetoshow, 0, 0);
			//sprite.image = canvas;
            //myself.droppedImage(canvas, name);
        };
		imagetoshow.src = line.url;
        //imagetoshow.width = screen.width * 0.1;
        //imagetoshow.height = screen.width * 0.1;
		//imagetoshow.setWidth(screen.width * 0.1);
		//imagetoshow.setHeight(screen.width * 0.1);
		
        //sprite.setWidth(screen.width * 0.1);
        //sprite.setHeight(screen.width * 0.1);
		//sprite.width = screen.width *0.2;

        sprite.image = imagetoshow;
        sprite.name = line.name;
		
		
		//imagetoshow.size = 10;
        //debugger;
        var heightindex = Math.floor(i/5);
        //sprite.setPosition(new Point(spacelength + (i%5)*150, spaceheight + (heightindex%3) * 180));
		sprite.setPosition(new Point(spacelength + (i%5)*myself.library.width() * 0.17, spaceheight + (heightindex%3) * myself.library.height() * 0.3));
        sprite.isDraggable = false;
        
		//imagetoshow.setExtent(thumbSize);
		thumbnail = new Morph();
		
		thumbnail.setExtent(thumbSize);
		thumbnail.image = sprite.thumbnail(thumbSize);
		thumbnail.setPosition(
        new Point(spacelength + (i%5)*myself.library.width() * 0.17, spaceheight + (heightindex%3) * myself.library.height() * 0.3)
		);
		thumbnail.fps = 3;
        //debugger;

        if(myself.tag1people){
            //console.log(line.tag1);
            if(line.tag1 === 'people'){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
            if(line.tag1 === 'animal' && myself.tag1animal){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
            if(line.tag1 === 'object' && myself.tag1object){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
			if(line.tag1 === 'singapore' && myself.tag2singapore){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
			if(line.tag1 === 'china' && myself.tag2china){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
			if(line.tag1 === 'india' && myself.tag2india){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
			if(line.tag1 === 'thailand' && myself.tag2thailand){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
			if(line.tag1 === 'other' && myself.tag2other){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
        } else if (myself.tag1animal){
            if(line.tag1 === 'animal'){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
            if(line.tag1 === 'object' && myself.tag1object){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
			if(line.tag1 === 'singapore' && myself.tag2singapore){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
			if(line.tag1 === 'china' && myself.tag2china){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
			if(line.tag1 === 'india' && myself.tag2india){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
			if(line.tag1 === 'thailand' && myself.tag2thailand){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
			if(line.tag1 === 'other' && myself.tag2other){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
        }else if (myself.tag1object){
			if(line.tag1 === 'object'){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
			if(line.tag1 === 'singapore' && myself.tag2singapore){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
			if(line.tag1 === 'china' && myself.tag2china){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
			if(line.tag1 === 'india' && myself.tag2india){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
			if(line.tag1 === 'japan' && myself.tag2japan){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
			if(line.tag1 === 'other' && myself.tag2other){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
		}else if (myself.tag2singapore){
			if(line.tag1 === 'singapore'){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
			if(line.tag1 === 'china' && myself.tag2china){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
			if(line.tag1 === 'india' && myself.tag2india){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
			if(line.tag1 === 'japan' && myself.tag2japan){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
			if(line.tag1 === 'other' && myself.tag2other){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
		}else if (myself.tag2china){
			if(line.tag1 === 'china'){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
			if(line.tag1 === 'india' && myself.tag2india){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
			if(line.tag1 === 'japan' && myself.tag2japan){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
			if(line.tag1 === 'other' && myself.tag2other){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
		}else if (myself.tag2india){
			if(line.tag1 === 'india'){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
			if(line.tag1 === 'japan' && myself.tag2japan){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
			if(line.tag1 === 'other' && myself.tag2other){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
		}else if (myself.tag2japan){
			if(line.tag1 === 'japan'){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
			if(line.tag1 === 'other' && myself.tag2other){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
		}else if (myself.tag2other){
			if(line.tag1 === 'other'){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(thumbnail);
                }
            }
		}
        else{
            if(i >= minIndex && i <= maxIndex){
                mine.add(thumbnail);
            }
        }

        var buttonforadding;		//button to add sprite
        buttonforadding = new PushButtonMorph(
            this.library,
            function () {
                loadCostume(line.url);
                myself.library.cancel();
            },
            "+",
            null,
            null,
            null,
            'show green button'
        );
        buttonforadding.setWidth(70);
        buttonforadding.setHeight(70);
        buttonforadding.setPosition(new Point(spacelength + (i%5)*myself.library.width() * 0.17, spaceheight + (heightindex % 3) * myself.library.height() * 0.3));
        buttonforadding.label.setCenter(buttonforadding.center());


        //mine.add(buttonforadding);
        if(myself.tag1people){
            //debugger;
            if(line.tag1 === 'people'){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
            if(line.tag1 === 'animal' && myself.tag1animal){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
            if(line.tag1 === 'object' && myself.tag1object){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
			if(line.tag1 === 'singapore' && myself.tag2singapore){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
			if(line.tag1 === 'china' && myself.tag2china){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
			if(line.tag1 === 'india' && myself.tag2india){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
			if(line.tag1 === 'japan' && myself.tag2japan){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
			if(line.tag1 === 'other' && myself.tag2other){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
        }else if(myself.tag1animal){
            if(line.tag1 === 'animal'){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
            if(line.tag1 === 'object' && myself.tag1object){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
			if(line.tag1 === 'singapore' && myself.tag2singapore){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
			if(line.tag1 === 'china' && myself.tag2china){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
			if(line.tag1 === 'india' && myself.tag2india){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
			if(line.tag1 === 'japan' && myself.tag2japan){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
			if(line.tag1 === 'other' && myself.tag2other){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
        }else if(myself.tag1object){
			if(line.tag1 === 'object'){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
			if(line.tag1 === 'singapore' && myself.tag2singapore){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
			if(line.tag1 === 'china' && myself.tag2china){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
			if(line.tag1 === 'india' && myself.tag2india){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
			if(line.tag1 === 'japan' && myself.tag2japan){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
			if(line.tag1 === 'other' && myself.tag2other){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
		}else if(myself.tag2singapore){
			if(line.tag1 === 'singapore'){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
			if(line.tag1 === 'china' && myself.tag2china){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
			if(line.tag1 === 'india' && myself.tag2india){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
			if(line.tag1 === 'japan' && myself.tag2japan){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
			if(line.tag1 === 'other' && myself.tag2other){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
		}else if(myself.tag2china){
			if(line.tag1 === 'china'){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
			if(line.tag1 === 'india' && myself.tag2india){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
			if(line.tag1 === 'japan' && myself.tag2japan){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
			if(line.tag1 === 'other' && myself.tag2other){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
		}else if(myself.tag2india){
			if(line.tag1 === 'india'){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
			if(line.tag1 === 'japan' && myself.tag2japan){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
			if(line.tag1 === 'other' && myself.tag2other){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
		}else if(myself.tag2japan){
			if(line.tag1 === 'japan'){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
			if(line.tag1 === 'other' && myself.tag2other){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
		}else if(myself.tag2other){
			if(line.tag1 === 'other'){
                if(i >= minIndex && i <= maxIndex){
                    mine.add(buttonforadding);
                }
                i++;
            }
		}
        else{
            if(i >= minIndex && i <= maxIndex){
                mine.add(buttonforadding);
            }
            i++;
        }
        //myself.currentPage = 1;
        myself.maxPage = Math.ceil(i / 15);

    });

    this.showLibraryPages();

}

IDE_Morph.prototype.showLibraryPages = function() {
    var myself = this;
    var mine = this.library;
    var padding = 25;


    console.log("I'm at page " + myself.currentPage);
    pageText = new TextMorph(myself.currentPage.toString() + " / " + myself.maxPage.toString());
    pageText.isBold = true;
    pageText.setFontSize(20);
    pageText.setCenter(this.library.center());
    pageText.setBottom(this.library.bottom() - padding);

    var nextButton;     //next button
    nextButton = new PushButtonMorph(
        myself.library,
        function(){
            //debugger;
            myself.currentPage++;
            if(myself.currentPage > myself.maxPage){
                myself.currentPage = 1;
            }
            myself.openLibrary();
            mine.destroy();
        },
        "Next",
        null,
        null,
        null
    );

    nextButton.setWidth(50);
    nextButton.setHeight(20);
    nextButton.setLeft(pageText.right() + padding);
    nextButton.setTop(pageText.top());
    nextButton.label.setCenter(nextButton.center());

    var prevButton;        //next button
    prevButton = new PushButtonMorph(
        myself.library,
        function(){
            //debugger;
            myself.currentPage--;
            if(myself.currentPage <= 0){
                myself.currentPage = myself.maxPage;
            }
            myself.openLibrary();
            mine.destroy();
        },
        "Prev",
        null,
        null,
        null
    );

    prevButton.setWidth(nextButton.width());
    prevButton.setHeight(nextButton.height());
    prevButton.setRight(pageText.left() - padding);
    prevButton.setTop(pageText.top());
    prevButton.label.setCenter(prevButton.center());


    this.library.add(prevButton);
    this.library.add(nextButton);
    this.library.add(pageText);
	
	this.library.changed;
	//this.goNextPage();
}

IDE_Morph.prototype.goNextPage = function() {
    var myself = this;
    var mine = this.library;
    myself.currentPage++;
    if(myself.currentPage > myself.maxPage){
        myself.currentPage = 1;
    }
	myself.refreshPage++;
    myself.openLibrary();
    mine.destroy();
};

IDE_Morph.prototype.goPrevPage = function() {
	var myself = this;
    var mine = this.library;
    myself.currentPage--;
    if(myself.currentPage <= 0){
        myself.currentPage = myself.maxPage;
    }
	myself.refreshPage++;
    myself.openLibrary();
    mine.destroy();
};



// IDE_Morph layout

// xinni: decide width, height, position of frames here.
IDE_Morph.prototype.fixLayout = function (situation) {
    // situation is a string, i.e.
    // 'selectSprite' or 'refreshPalette' or 'tabEditor'

    // paddings
    var padding = this.padding;
    var corralBarPadding = 5;
    var shareBoxTitleTopPadding = 5;
    var shareBoxTitleLeftPadding = 40;
    var shareBoxInternalTopPadding = 35;
    var shareBoxInternalLeftPadding = 6;

    // heights and widths
    var shareBoxTitleBarButtonsWidth = 90;
    var shareBoxTitleBarHeight = 30;
    var corralBarHeight = 90;

    // position points
    var spriteBarPosition = new Point(205, 145);
    var corralPosition = new Point(260, 50);

    Morph.prototype.trackChanges = false;

    if (situation !== 'refreshPalette') {
        // controlBar
        this.controlBar.setPosition(this.logo.topRight());
        this.controlBar.setWidth(this.right() - this.controlBar.left());
        this.controlBar.fixLayout();

        // categories
        this.categories.setLeft(this.logo.left());
        this.categories.setTop(this.logo.bottom());
    }

    // palette
    this.palette.setLeft(this.logo.left());
    this.palette.setTop(this.categories.bottom());
    this.palette.setHeight(this.bottom() - this.palette.top());


    // layout of stage, sprite editor, corral, sharebox.
    if (situation !== 'refreshPalette') {
        // stage
        if (this.isAppMode) {
            this.stage.setScale(Math.floor(Math.min(
                    (this.width() - padding * 2) / this.stage.dimensions.x,
                    (this.height() - this.controlBar.height() * 2 - padding * 2)
                    / this.stage.dimensions.y
                      ) * 10) / 10);
            this.stage.setCenter(this.center());
        } else {
//            this.stage.setScale(this.isSmallStage ? 0.5 : 1);
            this.stage.setScale(this.isSmallStage ? this.stageRatio : 1);
            this.stage.setTop(this.logo.bottom() + padding);
            this.stage.setRight(this.right());
        }

        // spriteBar
        this.spriteBar.setPosition(this.logo.bottomRight().add(padding));
        this.spriteBar.setPosition(spriteBarPosition);
        this.spriteBar.setExtent(new Point(
            Math.max(0, this.stage.left() - padding - this.spriteBar.left()),
                this.categories.bottom() - this.spriteBar.top() - padding
        ));
        this.spriteBar.fixLayout();

        // spriteEditor
        if (this.spriteEditor.isVisible) {
            this.spriteEditor.setPosition(this.spriteBar.bottomLeft());
            this.spriteEditor.setPosition(new Point(205, 220));
            this.spriteEditor.setExtent(new Point(
                    this.spriteBar.width() - 5,
                    this.bottom() - this.spriteEditor.top()
            ));
        }

        // corralBar
        //this.corralBar.setLeft(this.stage.left());
        this.corralBar.setLeft(this.stage.left());
        this.corralBar.setPosition(this.logo.bottomRight().add(corralBarPadding));
        this.corralBar.setHeight(corralBarHeight);

        // corral
        if (!contains(['selectSprite', 'tabEditor'], situation)) {
            this.corral.setPosition(corralPosition);
            this.corral.setTop(this.logo.bottom() + corralBarPadding);
            //this.corral.setLeft(240);
            //this.corral.setWidth(this.stage.width());
            this.corral.setWidth(this.spriteBar.width() - 60);
            //this.corral.setHeight(this.bottom() - this.corral.top());
            this.corral.setHeight(corralBarHeight);
            this.corral.fixLayout();
        }

        // Share Box Title Bar
        if (this.shareBoxTitleBar) {
            this.shareBoxTitleBar.setTop(this.stage.bottom() + shareBoxTitleTopPadding);
            this.shareBoxTitleBar.setLeft(this.stage.left());
            this.shareBoxTitleBar.setWidth(this.stage.width());
            this.shareBoxTitleBar.setHeight(shareBoxTitleBarHeight);
            //this.shareBoxTitleBar.fixLayout();
        }

        // Share Box Title Buttons
        if (this.shareBoxTitleBarButtons) {
            this.shareBoxTitleBarButtons.setTop(this.stage.bottom() + shareBoxTitleTopPadding);
            this.shareBoxTitleBarButtons.setRight(this.stage.right());
            this.shareBoxTitleBarButtons.setWidth(shareBoxTitleBarButtonsWidth + 150);
            this.shareBoxTitleBarButtons.setHeight(shareBoxTitleBarHeight);
            //this.shareBoxTitleBarButtons.fixLayout();
        }

        // Share Box Tab Bar
        if (this.shareBoxBar) {
            this.shareBoxBar.setTop(this.stage.bottom() - shareBoxTitleLeftPadding + shareBoxTitleBarHeight);
            this.shareBoxBar.setLeft(this.categories.width() + this.spriteBar.width() + 2 * padding + this.stage.width() / 1.5);
            this.shareBoxBar.fixLayout(); // xinni: position the tabs
        }

        // Share Box
        if (this.shareBox) {
            this.shareBox.setTop(this.stage.bottom() + shareBoxInternalTopPadding + shareBoxTitleBarHeight);
            this.shareBox.setLeft(this.categories.width() + this.spriteBar.width() + shareBoxInternalLeftPadding);
            this.shareBox.setWidth(this.stage.width());
            this.shareBox.setHeight(this.bottom() - this.shareBox.top());
        }

        // Share Box
        if (this.shareAssetsBox) {
            this.shareAssetsBox.setTop(this.stage.bottom() + shareBoxInternalTopPadding + shareBoxTitleBarHeight);
            this.shareAssetsBox.setLeft(this.categories.width() + this.spriteBar.width() + shareBoxInternalLeftPadding);
            this.shareAssetsBox.setWidth(this.stage.width());
            this.shareAssetsBox.setHeight(this.bottom() - this.shareAssetsBox.top());
        }

        // Share Box Disconnected Window
        if (this.shareBoxDisconnectedWindow) {
            this.shareBoxDisconnectedWindow.setTop(this.stage.bottom() + shareBoxTitleTopPadding);
            this.shareBoxDisconnectedWindow.setLeft(this.stage.left());
            this.shareBoxDisconnectedWindow.setWidth(this.stage.width());
            this.shareBoxDisconnectedWindow.setHeight(this.height() - this.stage.height());
        }

        // Share Box Connect Tab Bar
        if (this.shareBoxConnectBar) {
            this.shareBoxConnectBar.setTop(this.stage.bottom() - shareBoxTitleLeftPadding + shareBoxTitleBarHeight);
            this.shareBoxConnectBar.setLeft(this.categories.width() + this.spriteBar.width() + 2 * padding);
            this.shareBoxConnectBar.fixLayout();
        }

        // Share Box Connect
        if (this.shareBoxConnect) {
            this.shareBoxConnect.setTop(this.shareBox.top());
            this.shareBoxConnect.setLeft(this.shareBox.left());
            this.shareBoxConnect.setWidth(this.stage.width());
            this.shareBoxConnect.setHeight(this.bottom() - this.stage.bottom() + shareBoxInternalTopPadding);
            if (this.newGroupScreen) {
                this.newGroupScreen.setExtent(new Point(this.shareBoxConnect.width(), this.shareBoxConnect.height()));
            }
            if (this.requestReceivedScreen) {
                this.requestReceivedScreen.setExtent(new Point(this.shareBoxConnect.width(), this.shareBoxConnect.height()));
            }
        }

        // ShareBox Group Request Received (under sharebox connect)
        if (this.requestReceivedScreen) {
            this.requestReceivedScreen.setExtent(new Point(this.shareBoxConnect.width(), this.shareBoxConnect.height()));
        }

        // Sharebox No scripts Message (under sharebox)
        if (this.noScriptsMessage && this.shareBox) {
            this.noScriptsMessage.setHeight(this.shareBox.height());
            this.noScriptsMessage.setWidth(this.shareBox.width());
        }

        // huan song most likely scrapping these?
        /*
        if (this.addScriptScreen) {
            this.addScriptScreen.setTop(this.stage.bottom() + shareBoxInternalTopPadding);
            this.addScriptScreen.setLeft(this.categories.width() + this.spriteBar.width() + shareBoxInternalLeftPadding);
            this.addScriptScreen.setWidth(this.stage.width());
            this.addScriptScreen.setHeight(this.bottom() - this.shareBox.top());
        }

        if (this.scriptListScreen) {
            this.scriptListScreen.setTop(this.stage.bottom() + shareBoxInternalTopPadding);
            this.scriptListScreen.setLeft(this.categories.width() + this.spriteBar.width() + shareBoxInternalLeftPadding);
            this.scriptListScreen.setWidth(this.stage.width());
            this.scriptListScreen.setHeight(this.bottom() - this.shareBox.top());
        }*/
    }

    Morph.prototype.trackChanges = true;
    this.changed();
};

IDE_Morph.prototype.setProjectName = function (string) {
    this.projectName = string.replace(/['"]/g, ''); // filter quotation marks
    this.hasChangedMedia = true;
    this.controlBar.updateLabel();
};

// IDE_Morph resizing

IDE_Morph.prototype.setExtent = function (point) {
    var padding = new Point(430, 110),
        minExt,
        ext;

    // determine the minimum dimensions making sense for the current mode
    if (this.isAppMode) {
        minExt = StageMorph.prototype.dimensions.add(
                this.controlBar.height() + 10
        );
    } else {
        /* // auto-switches to small stage mode, commented out b/c I don't like it
         if (point.x < 910) {
         this.isSmallStage = true;
         this.stageRatio = 0.5;
         }
         */
        minExt = this.isSmallStage ?
            padding.add(StageMorph.prototype.dimensions.divideBy(2))
            : padding.add(StageMorph.prototype.dimensions);
        /*
         minExt = this.isSmallStage ?
         new Point(700, 350) : new Point(910, 490);
         */
    }
    ext = point.max(minExt);
    IDE_Morph.uber.setExtent.call(this, ext);
    this.fixLayout();
};

// IDE_Morph events

IDE_Morph.prototype.reactToWorldResize = function (rect) {
    if (this.isAutoFill) {
        this.setPosition(rect.origin);
        this.setExtent(rect.extent());
    }
    if (this.filePicker) {
        document.body.removeChild(this.filePicker);
        this.filePicker = null;
    }
};

IDE_Morph.prototype.droppedImage = function (aCanvas, name) {
    var costume = new Costume(
        aCanvas,
        this.currentSprite.newCostumeName(
            name ? name.split('.')[0] : '' // up to period
        )
    );

    if (costume.isTainted()) {
        this.inform(
            'Unable to import this image',
                'The picture you wish to import has been\n' +
                'tainted by a restrictive cross-origin policy\n' +
                'making it unusable for costumes in Snap!. \n\n' +
                'Try downloading this picture first to your\n' +
                'computer, and import it from there.'
        );
        return;
    }

    this.currentSprite.addCostume(costume);
    this.currentSprite.wearCostume(costume);
    this.spriteBar.tabBar.tabTo('costumes');
    this.hasChangedMedia = true;
};

IDE_Morph.prototype.droppedSVG = function (anImage, name) {
    var costume = new SVG_Costume(anImage, name.split('.')[0]);
    this.currentSprite.addCostume(costume);
    this.currentSprite.wearCostume(costume);
    this.spriteBar.tabBar.tabTo('costumes');
    this.hasChangedMedia = true;
    this.showMessage(
        'SVG costumes are\nnot yet fully supported\nin every browser',
        2
    );
};

IDE_Morph.prototype.droppedAudio = function (anAudio, name) {
    this.currentSprite.addSound(anAudio, name.split('.')[0]); // up to period
    this.spriteBar.tabBar.tabTo('sounds');
    this.hasChangedMedia = true;
};

IDE_Morph.prototype.droppedText = function (aString, name) {
    var lbl = name ? name.split('.')[0] : '';
    if (aString.indexOf('<project') === 0) {
        return this.openProjectString(aString);
    }
    if (aString.indexOf('<snapdata') === 0) {
        return this.openCloudDataString(aString);
    }
    if (aString.indexOf('<blocks') === 0) {
        return this.openBlocksString(aString, lbl, true);
    }
    if (aString.indexOf('<sprites') === 0) {
        return this.openSpritesString(aString);
    }
    if (aString.indexOf('<media') === 0) {
        return this.openMediaString(aString);
    }
};

IDE_Morph.prototype.droppedBinary = function (anArrayBuffer, name) {
    // dynamically load ypr->Snap!
    var ypr = document.getElementById('ypr'),
        myself = this,
        suffix = name.substring(name.length - 3);

    if (suffix.toLowerCase() !== 'ypr') {
        return;
    }

    function loadYPR(buffer, lbl) {
        var reader = new sb.Reader(),
            pname = lbl.split('.')[0]; // up to period
        reader.onload = function (info) {
            myself.droppedText(new sb.XMLWriter().write(pname, info));
        };
        reader.readYPR(new Uint8Array(buffer));
    }

    if (!ypr) {
        ypr = document.createElement('script');
        ypr.id = 'ypr';
        ypr.onload = function () {
            loadYPR(anArrayBuffer, name);
        };
        document.head.appendChild(ypr);
        ypr.src = 'ypr.js';
    } else {
        loadYPR(anArrayBuffer, name);
    }
};

// IDE_Morph button actions

IDE_Morph.prototype.refreshPalette = function (shouldIgnorePosition) {
    var oldTop = this.palette.contents.top();

    this.createPalette();
    this.fixLayout('refreshPalette');
    if (!shouldIgnorePosition) {
        this.palette.contents.setTop(oldTop);
    }
};

IDE_Morph.prototype.pressStart = function () {
    if (this.world().currentKey === 16) { // shiftClicked
        this.toggleFastTracking();
    } else {
        this.runScripts();
    }
};

IDE_Morph.prototype.toggleFastTracking = function () {
    if (this.stage.isFastTracked) {
        this.stopFastTracking();
    } else {
        this.startFastTracking();
    }
};

IDE_Morph.prototype.toggleVariableFrameRate = function () {
    if (StageMorph.prototype.frameRate) {
        StageMorph.prototype.frameRate = 0;
        this.stage.fps = 0;
    } else {
        StageMorph.prototype.frameRate = 30;
        this.stage.fps = 30;
    }
};

IDE_Morph.prototype.startFastTracking = function () {
    this.stage.isFastTracked = true;
    this.stage.fps = 0;
    this.controlBar.startButton.labelString = new SymbolMorph('flash', 14);
    this.controlBar.startButton.drawNew();
    this.controlBar.startButton.fixLayout();
};

IDE_Morph.prototype.stopFastTracking = function () {
    this.stage.isFastTracked = false;
    this.stage.fps = this.stage.frameRate;
    this.controlBar.startButton.labelString = new SymbolMorph('flag', 14);
    this.controlBar.startButton.drawNew();
    this.controlBar.startButton.fixLayout();
};

IDE_Morph.prototype.runScripts = function () {
    this.stage.fireGreenFlagEvent();
};

IDE_Morph.prototype.togglePauseResume = function () {
    if (this.stage.threads.isPaused()) {
        this.stage.threads.resumeAll(this.stage);
    } else {
        this.stage.threads.pauseAll(this.stage);
    }
    this.controlBar.pauseButton.refresh();
};

IDE_Morph.prototype.isPaused = function () {
    if (!this.stage) {
        return false;
    }
    return this.stage.threads.isPaused();
};

IDE_Morph.prototype.stopAllScripts = function () {
    this.stage.fireStopAllEvent();
};

IDE_Morph.prototype.selectSprite = function (sprite) {
    this.currentSprite = sprite;
    this.createPalette();
    this.createSpriteBar();
    this.createSpriteEditor();
    this.corral.refresh();
    this.fixLayout('selectSprite');
    this.currentSprite.scripts.fixMultiArgs();
};

// IDE_Morph skins

IDE_Morph.prototype.defaultDesign = function () {
    this.setDefaultDesign();
    this.refreshIDE();
    this.removeSetting('design');
};

IDE_Morph.prototype.flatDesign = function () {
    this.setFlatDesign();
    this.refreshIDE();
    this.saveSetting('design', 'flat');
};

IDE_Morph.prototype.refreshIDE = function () {
    var projectData;

    if (Process.prototype.isCatchingErrors) {
        try {
            projectData = this.serializer.serialize(this.stage);
        } catch (err) {
            this.showMessage('Serialization failed: ' + err);
        }
    } else {
        projectData = this.serializer.serialize(this.stage);
    }
    SpriteMorph.prototype.initBlocks();
    this.buildPanes();
    this.fixLayout();
    if (this.loadNewProject) {
        this.newProject();
    } else {
        this.openProjectString(projectData);
    }
};

// IDE_Morph settings persistance

IDE_Morph.prototype.applySavedSettings = function () {
    var design = this.getSetting('design'),
        zoom = this.getSetting('zoom'),
        language = this.getSetting('language'),
        click = this.getSetting('click'),
        longform = this.getSetting('longform'),
        plainprototype = this.getSetting('plainprototype');

    // design
    if (design === 'flat') {
        this.setFlatDesign();
    } else {
        this.setDefaultDesign();
    }

    // blocks zoom
    if (zoom) {
        SyntaxElementMorph.prototype.setScale(Math.min(zoom, 12));
        CommentMorph.prototype.refreshScale();
        SpriteMorph.prototype.initBlocks();
    }

    // language
    if (language && language !== 'en') {
        this.userLanguage = language;
    } else {
        this.userLanguage = null;
    }

    //  click
    if (click && !BlockMorph.prototype.snapSound) {
        BlockMorph.prototype.toggleSnapSound();
    }

    // long form
    if (longform) {
        InputSlotDialogMorph.prototype.isLaunchingExpanded = true;
    }

    // plain prototype labels
    if (plainprototype) {
        BlockLabelPlaceHolderMorph.prototype.plainLabel = true;
    }
};

IDE_Morph.prototype.saveSetting = function (key, value) {
    if (localStorage) {
        localStorage['-snap-setting-' + key] = value;
    }
};

IDE_Morph.prototype.getSetting = function (key) {
    if (localStorage) {
        return localStorage['-snap-setting-' + key];
    }
    return null;
};

IDE_Morph.prototype.removeSetting = function (key) {
    if (localStorage) {
        delete localStorage['-snap-setting-' + key];
    }
};

// IDE_Morph sprite list access

IDE_Morph.prototype.addNewSprite = function () {
    var sprite = new SpriteMorph(this.globalVariables),
        rnd = Process.prototype.reportRandom;

    sprite.name = this.newSpriteName(sprite.name);
    sprite.setCenter(this.stage.center());
    this.stage.add(sprite);

    // randomize sprite properties
    sprite.setHue(rnd.call(this, 0, 100));
    sprite.setBrightness(rnd.call(this, 50, 100));
    sprite.turn(rnd.call(this, 1, 360));
    sprite.setXPosition(rnd.call(this, -220, 220));
    sprite.setYPosition(rnd.call(this, -160, 160));

    this.sprites.add(sprite);
    this.corral.addSprite(sprite);
    this.selectSprite(sprite);
};

IDE_Morph.prototype.paintNewSprite = function () {
    var sprite = new SpriteMorph(this.globalVariables),
        cos = new Costume(),
        myself = this;

    sprite.name = this.newSpriteName(sprite.name);
    sprite.setCenter(this.stage.center());
    this.stage.add(sprite);
    this.sprites.add(sprite);
    this.corral.addSprite(sprite);
    this.selectSprite(sprite);
    cos.edit(
        this.world(),
        this,
        true,
        function () {
            myself.removeSprite(sprite);
        },
        function () {
            sprite.addCostume(cos);
            sprite.wearCostume(cos);
        }
    );
};

IDE_Morph.prototype.addNewSpritePrototype = function () {
    var sprite = new SpriteMorph(new Image()),
        cos = new Costume(newCanvas(new Point(100, 100)), new Image('library2.jpg')),
        myself = this;

    img = new Image();
    img.src = 'merlion.jpg';

    sprite.image = img;

    //sprite.name = this.newSpriteName('Merlion');
    sprite.name = 'Merlion';
    sprite.setCenter(this.stage.center());
    this.stage.add(sprite);

    this.sprites.add(sprite);
    this.corral.addSprite(sprite);
    this.selectSprite(sprite);

    //myself.removeSprite(sprite);
    //sprite.addCostume(cos);
    //sprite.wearCostume(cos);
}

IDE_Morph.prototype.nextScene = function () {
    var db = new DialogBoxMorph();
    //var button;
    var nextscenebutton;
    var pic = newCanvas(new Point(
        //434, 294
        900, 550
    ));

    ctx = pic.getContext("2d");
    img = new Image();
    img.src = 'library2.jpg';
    img.onload = function () {
        // create pattern
        var ptrn = ctx.createPattern(img, 'repeat'); // Create a pattern with this image, and set it to "repeat".
        ctx.fillStyle = ptrn;
        ctx.fillRect(0, 0, pic.width, pic.height); // context.fillRect(x, y, width, height);
    };

    db.inform(
        'Import Resource',
        'I have a gigantic unicorn',
        this.world(),
        pic,
        'library window'
    );

    var button;		//merlion
    button = new PushButtonMorph(
        this,
        'addNewSpritePrototype',
        "+",
        null,
        null,
        null,
        'show green button'
    );

    button.setWidth(70);
    button.setHeight(70);

    button.setPosition(new Point(780, 425));

    db.add(button);

    var button2;		//$1 coin
    button2 = new PushButtonMorph(
        this,
        'addNewSpritePrototype',
        "+",
        null,
        null,
        null,
        'show green button'
    );

    button2.setWidth(70);
    button2.setHeight(70);

    button2.setPosition(new Point(935, 425));

    db.add(button2);

    var button3;		//Chinese boy
    button3 = new PushButtonMorph(
        this,
        'addNewSpritePrototype',
        "+",
        null,
        null,
        null,
        'show green button'
    );

    button3.setWidth(70);
    button3.setHeight(70);

    button3.setPosition(new Point(780, 265));

    db.add(button3);

    var button4;		//malay girl
    button4 = new PushButtonMorph(
        this,
        'addNewSpritePrototype',
        "+",
        null,
        null,
        null,
        'show green button'
    );

    button4.setWidth(70);
    button4.setHeight(70);

    button4.setPosition(new Point(935, 265));

    db.add(button4);

    var button5;		//indian boy
    button5 = new PushButtonMorph(
        this,
        'addNewSpritePrototype',
        "+",
        null,
        null,
        null,
        'show green button'
    );

    button5.setWidth(70);
    button5.setHeight(70);

    button5.setPosition(new Point(1090, 265));

    db.add(button5);

    var button6;		//ah lian
    button6 = new PushButtonMorph(
        this,
        'addNewSpritePrototype',
        "+",
        null,
        null,
        null,
        'show green button'
    );

    button6.setWidth(70);
    button6.setHeight(70);

    button6.setPosition(new Point(1245, 265));

    db.add(button6);

}


IDE_Morph.prototype.duplicateSprite = function (sprite) {
    var duplicate = sprite.fullCopy();

    duplicate.setPosition(this.world().hand.position());
    duplicate.appearIn(this);
    duplicate.keepWithin(this.stage);
    this.selectSprite(duplicate);
};

IDE_Morph.prototype.removeSprite = function (sprite) {
    var idx, myself = this;
    sprite.parts.forEach(function (part) {
        myself.removeSprite(part);
    });
    idx = this.sprites.asArray().indexOf(sprite) + 1;
    this.stage.threads.stopAllForReceiver(sprite);
    sprite.destroy();
    this.stage.watchers().forEach(function (watcher) {
        if (watcher.object() === sprite) {
            watcher.destroy();
        }
    });
    if (idx > 0) {
        this.sprites.remove(idx);
    }
    this.createCorral();
    this.fixLayout();
    this.currentSprite = detect(
        this.stage.children,
        function (morph) {
            return morph instanceof SpriteMorph;
        }
    ) || this.stage;

    this.selectSprite(this.currentSprite);
};

IDE_Morph.prototype.newSpriteName = function (name, ignoredSprite) {
    var ix = name.indexOf('('),
        stem = (ix < 0) ? name : name.substring(0, ix),
        count = 1,
        newName = stem,
        all = this.sprites.asArray().filter(
            function (each) {
                return each !== ignoredSprite;
            }
        ).map(
            function (each) {
                return each.name;
            }
        );
    while (contains(all, newName)) {
        count += 1;
        newName = stem + '(' + count + ')';
    }
    return newName;
};

// IDE_Morph menus

IDE_Morph.prototype.userMenu = function () {
    var menu = new MenuMorph(this);
    // menu.addItem('help', 'nop');
    return menu;
};

IDE_Morph.prototype.snapMenu = function () {
    var menu,
        world = this.world();

    menu = new MenuMorph(this);
    menu.addItem('About...', 'aboutSnap');
    menu.addLine();
    menu.addItem(
        'Reference manual',
        function () {
            window.open('help/SnapManual.pdf', 'SnapReferenceManual');
        }
    );
    menu.addItem(
        'Snap! website',
        function () {
            window.open('http://snap.berkeley.edu/', 'SnapWebsite');
        }
    );
    menu.addItem(
        'Download source',
        function () {
            window.open(
                'http://snap.berkeley.edu/snapsource/snap.zip',
                'SnapSource'
            );
        }
    );
    if (world.isDevMode) {
        menu.addLine();
        menu.addItem(
            'Switch back to user mode',
            'switchToUserMode',
                'disable deep-Morphic\ncontext menus'
                + '\nand show user-friendly ones',
            new Color(0, 100, 0)
        );
    } else if (world.currentKey === 16) { // shift-click
        menu.addLine();
        menu.addItem(
            'Switch to dev mode',
            'switchToDevMode',
                'enable Morphic\ncontext menus\nand inspectors,'
                + '\nnot user-friendly!',
            new Color(100, 0, 0)
        );
    }
    menu.popup(world, this.logo.bottomLeft());
};

IDE_Morph.prototype.cloudMenu = function () {
    var menu,
        myself = this,
        world = this.world(),
        pos = this.controlBar.cloudButton.bottomLeft(),
        shiftClicked = (world.currentKey === 16);

    menu = new MenuMorph(this);
    if (shiftClicked) {
        menu.addItem(
            'url...',
            'setCloudURL',
            null,
            new Color(100, 0, 0)
        );
        menu.addLine();
    }
    if (!SnapCloud.username) {
        menu.addItem(
            'Login...',
            'initializeCloud'
        );
        menu.addItem(
            'Signup...',
            'createCloudAccount'
        );
        menu.addItem(
            'Reset Password...',
            'resetCloudPassword'
        );
    } else {
        menu.addItem(
                localize('Logout') + ' ' + SnapCloud.username,
            'logout'
        );
        menu.addItem(
            'Change Password...',
            'changeCloudPassword'
        );
    }
    if (shiftClicked) {
        menu.addLine();
        menu.addItem(
            'export project media only...',
            function () {
                if (myself.projectName) {
                    myself.exportProjectMedia(myself.projectName);
                } else {
                    myself.prompt('Export Project As...', function (name) {
                        myself.exportProjectMedia(name);
                    }, null, 'exportProject');
                }
            },
            null,
            this.hasChangedMedia ? new Color(100, 0, 0) : new Color(0, 100, 0)
        );
        menu.addItem(
            'export project without media...',
            function () {
                if (myself.projectName) {
                    myself.exportProjectNoMedia(myself.projectName);
                } else {
                    myself.prompt('Export Project As...', function (name) {
                        myself.exportProjectNoMedia(name);
                    }, null, 'exportProject');
                }
            },
            null,
            new Color(100, 0, 0)
        );
        menu.addItem(
            'export project as cloud data...',
            function () {
                if (myself.projectName) {
                    myself.exportProjectAsCloudData(myself.projectName);
                } else {
                    myself.prompt('Export Project As...', function (name) {
                        myself.exportProjectAsCloudData(name);
                    }, null, 'exportProject');
                }
            },
            null,
            new Color(100, 0, 0)
        );
        menu.addLine();
        menu.addItem(
            'open shared project from cloud...',
            function () {
                myself.prompt('Author name…', function (usr) {
                    myself.prompt('Project name...', function (prj) {
                        var id = 'Username=' +
                            encodeURIComponent(usr.toLowerCase()) +
                            '&ProjectName=' +
                            encodeURIComponent(prj);
                        myself.showMessage(
                            'Fetching project\nfrom the cloud...'
                        );
                        SnapCloud.getPublicProject(
                            id,
                            function (projectData) {
                                var msg;
                                if (!Process.prototype.isCatchingErrors) {
                                    window.open(
                                            'data:text/xml,' + projectData
                                    );
                                }
                                myself.nextSteps([
                                    function () {
                                        msg = myself.showMessage(
                                            'Opening project...'
                                        );
                                    },
                                    function () {
                                        myself.rawOpenCloudDataString(
                                            projectData
                                        );
                                    },
                                    function () {
                                        msg.destroy();
                                    }
                                ]);
                            },
                            myself.cloudError()
                        );

                    }, null, 'project');
                }, null, 'project');
            },
            null,
            new Color(100, 0, 0)
        );
    }
    menu.popup(world, pos);
};

IDE_Morph.prototype.settingsMenu = function () {
    var menu,
        stage = this.stage,
        world = this.world(),
        myself = this,
        pos = this.controlBar.settingsButton.bottomLeft(),
        shiftClicked = (world.currentKey === 16);

    function addPreference(label, toggle, test, onHint, offHint, hide) {
        var on = '\u2611 ',
            off = '\u2610 ';
        if (!hide || shiftClicked) {
            menu.addItem(
                    (test ? on : off) + localize(label),
                toggle,
                test ? onHint : offHint,
                hide ? new Color(100, 0, 0) : null
            );
        }
    }

    menu = new MenuMorph(this);
    menu.addItem('Language...', 'languageMenu');
    menu.addItem(
        'Zoom blocks...',
        'userSetBlocksScale'
    );
    menu.addItem(
        'Stage size...',
        'userSetStageSize'
    );
    menu.addLine();
    addPreference(
        'Blurred shadows',
        'toggleBlurredShadows',
        useBlurredShadows,
        'uncheck to use solid drop\nshadows and highlights',
        'check to use blurred drop\nshadows and highlights',
        true
    );
    addPreference(
        'Zebra coloring',
        'toggleZebraColoring',
        BlockMorph.prototype.zebraContrast,
        'uncheck to disable alternating\ncolors for nested block',
        'check to enable alternating\ncolors for nested blocks',
        true
    );
    addPreference(
        'Dynamic input labels',
        'toggleDynamicInputLabels',
        SyntaxElementMorph.prototype.dynamicInputLabels,
        'uncheck to disable dynamic\nlabels for variadic inputs',
        'check to enable dynamic\nlabels for variadic inputs',
        true
    );
    addPreference(
        'Prefer empty slot drops',
        'togglePreferEmptySlotDrops',
        ScriptsMorph.prototype.isPreferringEmptySlots,
        'uncheck to allow dropped\nreporters to kick out others',
        'settings menu prefer empty slots hint',
        true
    );
    addPreference(
        'Long form input dialog',
        'toggleLongFormInputDialog',
        InputSlotDialogMorph.prototype.isLaunchingExpanded,
        'uncheck to use the input\ndialog in short form',
        'check to always show slot\ntypes in the input dialog'
    );
    addPreference(
        'Plain prototype labels',
        'togglePlainPrototypeLabels',
        BlockLabelPlaceHolderMorph.prototype.plainLabel,
        'uncheck to always show (+) symbols\nin block prototype labels',
        'check to hide (+) symbols\nin block prototype labels'
    );
    addPreference(
        'Virtual keyboard',
        'toggleVirtualKeyboard',
        MorphicPreferences.useVirtualKeyboard,
        'uncheck to disable\nvirtual keyboard support\nfor mobile devices',
        'check to enable\nvirtual keyboard support\nfor mobile devices',
        true
    );
    addPreference(
        'Input sliders',
        'toggleInputSliders',
        MorphicPreferences.useSliderForInput,
        'uncheck to disable\ninput sliders for\nentry fields',
        'check to enable\ninput sliders for\nentry fields'
    );
    if (MorphicPreferences.useSliderForInput) {
        addPreference(
            'Execute on slider change',
            'toggleSliderExecute',
            InputSlotMorph.prototype.executeOnSliderEdit,
            'uncheck to supress\nrunning scripts\nwhen moving the slider',
            'check to run\nthe edited script\nwhen moving the slider'
        );
    }
    addPreference(
        'Clicking sound',
        function () {
            BlockMorph.prototype.toggleSnapSound();
            if (BlockMorph.prototype.snapSound) {
                myself.saveSetting('click', true);
            } else {
                myself.removeSetting('click');
            }
        },
        BlockMorph.prototype.snapSound,
        'uncheck to turn\nblock clicking\nsound off',
        'check to turn\nblock clicking\nsound on'
    );
    addPreference(
        'Animations',
        function () {
            myself.isAnimating = !myself.isAnimating;
        },
        myself.isAnimating,
        'uncheck to disable\nIDE animations',
        'check to enable\nIDE animations',
        true
    );
    addPreference(
        'Turbo mode',
        'toggleFastTracking',
        this.stage.isFastTracked,
        'uncheck to run scripts\nat normal speed',
        'check to prioritize\nscript execution'
    );
    addPreference(
        'Rasterize SVGs',
        function () {
            MorphicPreferences.rasterizeSVGs = !MorphicPreferences.rasterizeSVGs;
        },
        MorphicPreferences.rasterizeSVGs,
        'uncheck for smooth\nscaling of vector costumes',
        'check to rasterize\nSVGs on import',
        true
    );
    addPreference(
        'Flat design',
        function () {
            if (MorphicPreferences.isFlat) {
                return myself.defaultDesign();
            }
            myself.flatDesign();
        },
        MorphicPreferences.isFlat,
        'uncheck for default\nGUI design',
        'check for alternative\nGUI design',
        false
    );
    addPreference(
        'Sprite Nesting',
        function () {
            SpriteMorph.prototype.enableNesting = !SpriteMorph.prototype.enableNesting;
        },
        SpriteMorph.prototype.enableNesting,
        'uncheck to disable\nsprite composition',
        'check to enable\nsprite composition',
        true
    );
    menu.addLine(); // everything below this line is stored in the project
    addPreference(
        'Thread safe scripts',
        function () {
            stage.isThreadSafe = !stage.isThreadSafe;
        },
        this.stage.isThreadSafe,
        'uncheck to allow\nscript reentrance',
        'check to disallow\nscript reentrance'
    );
    addPreference(
        'Prefer smooth animations',
        'toggleVariableFrameRate',
        StageMorph.prototype.frameRate,
        'uncheck for greater speed\nat variable frame rates',
        'check for smooth, predictable\nanimations across computers'
    );
    addPreference(
        'Flat line ends',
        function () {
            SpriteMorph.prototype.useFlatLineEnds = !SpriteMorph.prototype.useFlatLineEnds;
        },
        SpriteMorph.prototype.useFlatLineEnds,
        'uncheck for round ends of lines',
        'check for flat ends of lines'
    );
    addPreference(
        'Codification support',
        function () {
            StageMorph.prototype.enableCodeMapping = !StageMorph.prototype.enableCodeMapping;
            myself.currentSprite.blocksCache.variables = null;
            myself.currentSprite.paletteCache.variables = null;
            myself.refreshPalette();
        },
        StageMorph.prototype.enableCodeMapping,
        'uncheck to disable\nblock to text mapping features',
        'check for block\nto text mapping features',
        false
    );
    menu.popup(world, pos);
};

IDE_Morph.prototype.projectMenu = function () {
    var menu,
        myself = this,
        world = this.world(),
        pos = this.controlBar.projectButton.bottomLeft(),
        graphicsName = this.currentSprite instanceof SpriteMorph ?
            'Costumes' : 'Backgrounds',
        shiftClicked = (world.currentKey === 16);

    menu = new MenuMorph(this);
    menu.addItem('Project notes...', 'editProjectNotes');
    menu.addLine();
    menu.addItem('New', 'createNewProject');
    menu.addItem('Open...', 'openProjectsBrowser');
    menu.addItem('Save', "save");
    if (shiftClicked) {
        menu.addItem(
            'Save to disk',
            'saveProjectToDisk',
            'experimental - store this project\nin your downloads folder',
            new Color(100, 0, 0)
        );
    }
    menu.addItem('Save As...', 'saveProjectsBrowser');
    menu.addLine();
    menu.addItem(
        'Import...',
        function () {
            var inp = document.createElement('input');
            if (myself.filePicker) {
                document.body.removeChild(myself.filePicker);
                myself.filePicker = null;
            }
            inp.type = 'file';
            inp.style.color = "transparent";
            inp.style.backgroundColor = "transparent";
            inp.style.border = "none";
            inp.style.outline = "none";
            inp.style.position = "absolute";
            inp.style.top = "0px";
            inp.style.left = "0px";
            inp.style.width = "0px";
            inp.style.height = "0px";
            inp.addEventListener(
                "change",
                function () {
                    document.body.removeChild(inp);
                    myself.filePicker = null;
                    world.hand.processDrop(inp.files);
                },
                false
            );
            document.body.appendChild(inp);
            myself.filePicker = inp;
            inp.click();
        },
        'file menu import hint' // looks up the actual text in the translator
    );

    menu.addItem(
        shiftClicked ?
            'Export project as plain text...' : 'Export project...',
        function () {
            if (myself.projectName) {
                myself.exportProject(myself.projectName, shiftClicked);
            } else {
                myself.prompt('Export Project As...', function (name) {
                    myself.exportProject(name);
                }, null, 'exportProject');
            }
        },
        'show project data as XML\nin a new browser window',
        shiftClicked ? new Color(100, 0, 0) : null
    );

    menu.addItem(
        'Export blocks...',
        function () {
            myself.exportGlobalBlocks();
        },
        'show global custom block definitions as XML\nin a new browser window'
    );

    if (shiftClicked) {
        menu.addItem(
            'Export all scripts as pic...',
            function () {
                myself.exportScriptsPicture();
            },
            'show a picture of all scripts\nand block definitions',
            new Color(100, 0, 0)
        );
    }

    menu.addLine();
    menu.addItem(
        'Import tools',
        function () {
            myself.droppedText(
                myself.getURLsbeOrRelative(
                    'tools.xml'
                ),
                'tools'
            );
        },
        'load the official library of\npowerful blocks'
    );
    menu.addItem(
        'Libraries...',
        function () {
            // read a list of libraries from an external file,
            var libMenu = new MenuMorph(this, 'Import library'),
                libUrl = 'http://snap.berkeley.edu/snapsource/libraries/' +
                    'LIBRARIES';

            function loadLib(name) {
                var url = 'http://snap.berkeley.edu/snapsource/libraries/'
                    + name
                    + '.xml';
                myself.droppedText(myself.getURL(url), name);
            }

            myself.getURL(libUrl).split('\n').forEach(function (line) {
                if (line.length > 0) {
                    libMenu.addItem(
                        line.substring(line.indexOf('\t') + 1),
                        function () {
                            loadLib(
                                line.substring(0, line.indexOf('\t'))
                            );
                        }
                    );
                }
            });

            libMenu.popup(world, pos);
        },
        'Select categories of additional blocks to add to this project.'
    );

    menu.addItem(
            localize(graphicsName) + '...',
        function () {
            //var dir = graphicsName,
			var dir = 'api/library/costumes',
                names = myself.getCostumesList(dir),
                libMenu = new MenuMorph(
                    myself,
                        localize('Import') + ' ' + localize(dir)
                );

            function loadCostume(name) {
                //var url = dir + '/' + name,
				var url = name,
                    img = new Image();
                img.onload = function () {
                    var canvas = newCanvas(new Point(img.width, img.height));
                    canvas.getContext('2d').drawImage(img, 0, 0);
                    myself.droppedImage(canvas, name);
                };
                img.src = url;
            }

            names.forEach(function (line) {
				//console.log(line.length);
				//debugger;
                //if (line.length > 0) {
                    libMenu.addItem(
                        line.name,
                        function () {
                            loadCostume(line.url);
                        }
                    );
                //}
            });
            libMenu.popup(world, pos);
        },
        'Select a costume from the media library'
    );
    menu.addItem(
            localize('Sounds') + '...',
        function () {
            var names = this.getCostumesList('Sounds'),
                libMenu = new MenuMorph(this, 'Import sound');

            function loadSound(name) {
                var url = 'Sounds/' + name,
                    audio = new Audio();
                audio.src = url;
                audio.load();
                myself.droppedAudio(audio, name);
            }

            names.forEach(function (line) {
                if (line.length > 0) {
                    libMenu.addItem(
                        line,
                        function () {
                            loadSound(line);
                        }
                    );
                }
            });
            libMenu.popup(world, pos);
        },
        'Select a sound from the media library'
    );

    menu.popup(world, pos);
};

IDE_Morph.prototype.getCostumesList = function (dirname) {
    var dir,
        costumes = [];

    dir = JSON.parse(this.getURL(dirname));
	costumes = dir.data;
	//debugger;
	/*
	debugger;
    dir.split('\n').forEach(
        function (line) {
            var startIdx = line.search(new RegExp('href="[^./?].*"')),
                endIdx,
                name;

            if (startIdx > 0) {
                name = line.substring(startIdx + 6);
                endIdx = name.search(new RegExp('"'));
                name = name.substring(0, endIdx);
                costumes.push(name);
            }
        }
    );
    costumes.sort(function (x, y) {
        return x < y ? -1 : 1;
    });
	*/
    return costumes;
};


    // xinni: sharebox menu buttons
IDE_Morph.prototype.shareBoxSettingsMenu = function() {

    console.log("Settings for sharebox triggered");

    var menu,
        world = this.world(),
        pos = this.shareBoxTitleBarButtons.shareBoxSettingsButton.bottomLeft();

    menu = new MenuMorph(this);
    menu.addItem(
        'View/Edit Members',
        'showViewMembersPopup'
    );
    menu.addLine();
    menu.addItem(
        'Add Members',
        'showAddMemberPopup'
    );
    menu.addLine();
    menu.addItem(
        'Leave group',
        'showLeaveGroupPopup'
    );
    menu.popup(world, pos);

};


// IDE_Morph menu actions

IDE_Morph.prototype.aboutSnap = function () {
    var dlg, aboutTxt, noticeTxt, creditsTxt, versions = '', translations,
        module, btn1, btn2, btn3, btn4, licenseBtn, translatorsBtn,
        world = this.world();

    aboutTxt = 'Snap! 4.0\nBuild Your Own Blocks\n\n--- beta ---\n\n'
        + 'Copyright \u24B8 2014 Jens M\u00F6nig and '
        + 'Brian Harvey\n'
        + 'jens@moenig.org, bh@cs.berkeley.edu\n\n'

        + 'Snap! is developed by the University of California, Berkeley\n'
        + '          with support from the National Science Foundation '
        + 'and MioSoft.   \n'

        + 'The design of Snap! is influenced and inspired by Scratch,\n'
        + 'from the Lifelong Kindergarten group at the MIT Media Lab\n\n'

        + 'for more information see http://snap.berkeley.edu\n'
        + 'and http://scratch.mit.edu';

    noticeTxt = localize('License')
        + '\n\n'
        + 'Snap! is free software: you can redistribute it and/or modify\n'
        + 'it under the terms of the GNU Affero General Public License as\n'
        + 'published by the Free Software Foundation, either version 3 of\n'
        + 'the License, or (at your option) any later version.\n\n'

        + 'This program is distributed in the hope that it will be useful,\n'
        + 'but WITHOUT ANY WARRANTY; without even the implied warranty of\n'
        + 'MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the\n'
        + 'GNU Affero General Public License for more details.\n\n'

        + 'You should have received a copy of the\n'
        + 'GNU Affero General Public License along with this program.\n'
        + 'If not, see http://www.gnu.org/licenses/';

    creditsTxt = localize('Contributors')
        + '\n\nNathan Dinsmore: Saving/Loading, Snap-Logo Design, '
        + 'countless bugfixes'
        + '\nKartik Chandra: Paint Editor'
        + '\nMichael Ball: Time/Date UI, many bugfixes'
        + '\n"Ava" Yuan Yuan: Graphic Effects'
        + '\nKyle Hotchkiss: Block search design'
        + '\nIan Reynolds: UI Design, Event Bindings, '
        + 'Sound primitives'
        + '\nIvan Motyashov: Initial Squeak Porting'
        + '\nDavide Della Casa: Morphic Optimizations'
        + '\nAchal Dave: Web Audio'
        + '\nJoe Otto: Morphic Testing and Debugging';

    for (module in modules) {
        if (Object.prototype.hasOwnProperty.call(modules, module)) {
            versions += ('\n' + module + ' (' +
                modules[module] + ')');
        }
    }
    if (versions !== '') {
        versions = localize('current module versions:') + ' \n\n' +
            'morphic (' + morphicVersion + ')' +
            versions;
    }
    translations = localize('Translations') + '\n' + SnapTranslator.credits();

    dlg = new DialogBoxMorph();
    dlg.inform('About Snap', aboutTxt, world);
    btn1 = dlg.buttons.children[0];
    translatorsBtn = dlg.addButton(
        function () {
            dlg.body.text = translations;
            dlg.body.drawNew();
            btn1.show();
            btn2.show();
            btn3.hide();
            btn4.hide();
            licenseBtn.hide();
            translatorsBtn.hide();
            dlg.fixLayout();
            dlg.drawNew();
            dlg.setCenter(world.center());
        },
        'Translators...'
    );
    btn2 = dlg.addButton(
        function () {
            dlg.body.text = aboutTxt;
            dlg.body.drawNew();
            btn1.show();
            btn2.hide();
            btn3.show();
            btn4.show();
            licenseBtn.show();
            translatorsBtn.hide();
            dlg.fixLayout();
            dlg.drawNew();
            dlg.setCenter(world.center());
        },
        'Back...'
    );
    btn2.hide();
    licenseBtn = dlg.addButton(
        function () {
            dlg.body.text = noticeTxt;
            dlg.body.drawNew();
            btn1.show();
            btn2.show();
            btn3.hide();
            btn4.hide();
            licenseBtn.hide();
            translatorsBtn.hide();
            dlg.fixLayout();
            dlg.drawNew();
            dlg.setCenter(world.center());
        },
        'License...'
    );
    btn3 = dlg.addButton(
        function () {
            dlg.body.text = versions;
            dlg.body.drawNew();
            btn1.show();
            btn2.show();
            btn3.hide();
            btn4.hide();
            licenseBtn.hide();
            translatorsBtn.hide();
            dlg.fixLayout();
            dlg.drawNew();
            dlg.setCenter(world.center());
        },
        'Modules...'
    );
    btn4 = dlg.addButton(
        function () {
            dlg.body.text = creditsTxt;
            dlg.body.drawNew();
            btn1.show();
            btn2.show();
            translatorsBtn.show();
            btn3.hide();
            btn4.hide();
            licenseBtn.hide();
            dlg.fixLayout();
            dlg.drawNew();
            dlg.setCenter(world.center());
        },
        'Credits...'
    );
    translatorsBtn.hide();
    dlg.fixLayout();
    dlg.drawNew();
};

IDE_Morph.prototype.editProjectNotes = function () {
    var dialog = new DialogBoxMorph().withKey('projectNotes'),
        frame = new ScrollFrameMorph(),
        text = new TextMorph(this.projectNotes || ''),
        ok = dialog.ok,
        myself = this,
        size = 250,
        world = this.world();

    frame.padding = 6;
    frame.setWidth(size);
    frame.acceptsDrops = false;
    frame.contents.acceptsDrops = false;

    text.setWidth(size - frame.padding * 2);
    text.setPosition(frame.topLeft().add(frame.padding));
    text.enableSelecting();
    text.isEditable = true;

    frame.setHeight(size);
    frame.fixLayout = nop;
    frame.edge = InputFieldMorph.prototype.edge;
    frame.fontSize = InputFieldMorph.prototype.fontSize;
    frame.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    frame.contrast = InputFieldMorph.prototype.contrast;
    frame.drawNew = InputFieldMorph.prototype.drawNew;
    frame.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    frame.addContents(text);
    text.drawNew();

    dialog.ok = function () {
        myself.projectNotes = text.text;
        ok.call(this);
    };

    dialog.justDropped = function () {
        text.edit();
    };

    dialog.labelString = 'Project Notes';
    dialog.createLabel();
    dialog.addBody(frame);
    frame.drawNew();
    dialog.addButton('ok', 'OK');
    dialog.addButton('cancel', 'Cancel');
    dialog.fixLayout();
    dialog.drawNew();
    dialog.popUp(world);
    dialog.setCenter(world.center());
    text.edit();
};

IDE_Morph.prototype.newProject = function () {
    this.source = SnapCloud.username ? 'cloud' : 'local';
    if (this.stage) {
        this.stage.destroy();
    }
    if (location.hash.substr(0, 6) !== '#lang:') {
        location.hash = '';
    }
    this.globalVariables = new VariableFrame();
    this.currentSprite = new SpriteMorph(this.globalVariables);
    this.sprites = new List([this.currentSprite]);
    StageMorph.prototype.dimensions = new Point(480, 360);
    StageMorph.prototype.hiddenPrimitives = {};
    StageMorph.prototype.codeMappings = {};
    StageMorph.prototype.codeHeaders = {};
    StageMorph.prototype.enableCodeMapping = false;
    SpriteMorph.prototype.useFlatLineEnds = false;
    this.setProjectName('');
    this.projectNotes = '';
    this.createStage();
    this.add(this.stage);
    this.createCorral();
    this.selectSprite(this.stage.children[0]);
    this.fixLayout();
};

IDE_Morph.prototype.save = function () {
    if (this.source === 'examples') {
        this.source = 'local'; // cannot save to examples
    }
    if (this.projectName) {
        if (this.source === 'local') { // as well as 'examples'
            this.saveProject(this.projectName);
        } else { // 'cloud'
            this.saveProjectToCloud(this.projectName);
        }
    } else {
        this.saveProjectsBrowser();
    }
};


IDE_Morph.prototype.saveProject = function (name) {
    var myself = this;
    this.nextSteps([
        function () {
            myself.showMessage('Saving...');
        },
        function () {
            myself.rawSaveProject(name);
        }
    ]);
};

IDE_Morph.prototype.rawSaveProject = function (name) {
    var str;
    if (name) {
        this.setProjectName(name);
        if (Process.prototype.isCatchingErrors) {
            try {
                localStorage['-snap-project-' + name]
                    = str = this.serializer.serialize(this.stage);
                location.hash = '#open:' + str;
                this.showMessage('Saved!', 1);
            } catch (err) {
                this.showMessage('Save failed: ' + err);
            }
        } else {
            localStorage['-snap-project-' + name]
                = str = this.serializer.serialize(this.stage);
            location.hash = '#open:' + str;
            this.showMessage('Saved!', 1);
        }
    }
};

IDE_Morph.prototype.saveProjectToDisk = function () {
    var data,
        link = document.createElement('a');

    if (Process.prototype.isCatchingErrors) {
        try {
            data = this.serializer.serialize(this.stage);
            link.setAttribute('href', 'data:text/xml,' + data);
            link.setAttribute('download', this.projectName + '.xml');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            this.showMessage('Saving failed: ' + err);
        }
    } else {
        data = this.serializer.serialize(this.stage);
        link.setAttribute('href', 'data:text/xml,' + data);
        link.setAttribute('download', this.projectName + '.xml');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

IDE_Morph.prototype.exportProject = function (name, plain) {
    var menu, str;
    if (name) {
        this.setProjectName(name);
        if (Process.prototype.isCatchingErrors) {
            try {
                menu = this.showMessage('Exporting');
                str = encodeURIComponent(
                    this.serializer.serialize(this.stage)
                );
                location.hash = '#open:' + str;
                window.open('data:text/'
                    + (plain ? 'plain,' + str : 'xml,' + str));
                menu.destroy();
                this.showMessage('Exported!', 1);
            } catch (err) {
                this.showMessage('Export failed: ' + err);
            }
        } else {
            menu = this.showMessage('Exporting');
            str = encodeURIComponent(
                this.serializer.serialize(this.stage)
            );
            location.hash = '#open:' + str;
            window.open('data:text/'
                + (plain ? 'plain,' + str : 'xml,' + str));
            menu.destroy();
            this.showMessage('Exported!', 1);
        }
    }
};

IDE_Morph.prototype.exportGlobalBlocks = function () {
    if (this.stage.globalBlocks.length > 0) {
        new BlockExportDialogMorph(
            this.serializer,
            this.stage.globalBlocks
        ).popUp(this.world());
    } else {
        this.inform(
            'Export blocks',
                'this project doesn\'t have any\n'
                + 'custom global blocks yet'
        );
    }
};

IDE_Morph.prototype.exportSprite = function (sprite) {
    var str = this.serializer.serialize(sprite.allParts());
    window.open('data:text/xml,<sprites app="'
        + this.serializer.app
        + '" version="'
        + this.serializer.version
        + '">'
        + str
        + '</sprites>');
};

IDE_Morph.prototype.exportScriptsPicture = function () {
    var pics = [],
        pic,
        padding = 20,
        w = 0,
        h = 0,
        y = 0,
        ctx;

    // collect all script pics
    this.sprites.asArray().forEach(function (sprite) {
        pics.push(sprite.image);
        pics.push(sprite.scripts.scriptsPicture());
        sprite.customBlocks.forEach(function (def) {
            pics.push(def.scriptsPicture());
        });
    });
    pics.push(this.stage.image);
    pics.push(this.stage.scripts.scriptsPicture());
    this.stage.customBlocks.forEach(function (def) {
        pics.push(def.scriptsPicture());
    });

    // collect global block pics
    this.stage.globalBlocks.forEach(function (def) {
        pics.push(def.scriptsPicture());
    });

    pics = pics.filter(function (each) {
        return !isNil(each);
    });

    // determine dimensions of composite
    pics.forEach(function (each) {
        w = Math.max(w, each.width);
        h += (each.height);
        h += padding;
    });
    h -= padding;
    pic = newCanvas(new Point(w, h));
    ctx = pic.getContext('2d');

    // draw all parts
    pics.forEach(function (each) {
        ctx.drawImage(each, 0, y);
        y += padding;
        y += each.height;
    });

    window.open(pic.toDataURL());
};

IDE_Morph.prototype.openProjectString = function (str) {
    var msg,
        myself = this;
    this.nextSteps([
        function () {
            msg = myself.showMessage('Opening project...');
        },
        function () {
            myself.rawOpenProjectString(str);
        },
        function () {
            msg.destroy();
        }
    ]);
};

IDE_Morph.prototype.rawOpenProjectString = function (str) {
    this.toggleAppMode(false);
    this.spriteBar.tabBar.tabTo('scripts');
    StageMorph.prototype.hiddenPrimitives = {};
    StageMorph.prototype.codeMappings = {};
    StageMorph.prototype.codeHeaders = {};
    StageMorph.prototype.enableCodeMapping = false;
    if (Process.prototype.isCatchingErrors) {
        try {
            this.serializer.openProject(this.serializer.load(str), this);
        } catch (err) {
            this.showMessage('Load failed: ' + err);
        }
    } else {
        this.serializer.openProject(this.serializer.load(str), this);
    }
    this.stopFastTracking();
};

IDE_Morph.prototype.openCloudDataString = function (str) {
    var msg,
        myself = this;
    this.nextSteps([
        function () {
            msg = myself.showMessage('Opening project...');
        },
        function () {
            myself.rawOpenCloudDataString(str);
        },
        function () {
            msg.destroy();
        }
    ]);
};

IDE_Morph.prototype.rawOpenCloudDataString = function (str) {
    var model;
    StageMorph.prototype.hiddenPrimitives = {};
    StageMorph.prototype.codeMappings = {};
    StageMorph.prototype.codeHeaders = {};
    StageMorph.prototype.enableCodeMapping = false;
    if (Process.prototype.isCatchingErrors) {
        try {
            model = this.serializer.parse(str);
            this.serializer.loadMediaModel(model.childNamed('media'));
            this.serializer.openProject(
                this.serializer.loadProjectModel(model.childNamed('project')),
                this
            );
        } catch (err) {
            this.showMessage('Load failed: ' + err);
        }
    } else {
        model = this.serializer.parse(str);
        this.serializer.loadMediaModel(model.childNamed('media'));
        this.serializer.openProject(
            this.serializer.loadProjectModel(model.childNamed('project')),
            this
        );
    }
    this.stopFastTracking();
};

IDE_Morph.prototype.openBlocksString = function (str, name, silently) {
    var msg,
        myself = this;
    this.nextSteps([
        function () {
            msg = myself.showMessage('Opening blocks...');
        },
        function () {
            myself.rawOpenBlocksString(str, name, silently);
        },
        function () {
            msg.destroy();
        }
    ]);
};

IDE_Morph.prototype.rawOpenBlocksString = function (str, name, silently) {
    // name is optional (string), so is silently (bool)
    var blocks,
        myself = this;
    if (Process.prototype.isCatchingErrors) {
        try {
            blocks = this.serializer.loadBlocks(str, myself.stage);
        } catch (err) {
            this.showMessage('Load failed: ' + err);
        }
    } else {
        blocks = this.serializer.loadBlocks(str, myself.stage);
    }
    if (silently) {
        blocks.forEach(function (def) {
            def.receiver = myself.stage;
            myself.stage.globalBlocks.push(def);
            myself.stage.replaceDoubleDefinitionsFor(def);
        });
        this.flushPaletteCache();
        this.refreshPalette();
        this.showMessage(
                'Imported Blocks Module' + (name ? ': ' + name : '') + '.',
            2
        );
    } else {
        new BlockImportDialogMorph(blocks, this.stage, name).popUp();
    }
};

IDE_Morph.prototype.openSpritesString = function (str) {
    var msg,
        myself = this;
    this.nextSteps([
        function () {
            msg = myself.showMessage('Opening sprite...');
        },
        function () {
            myself.rawOpenSpritesString(str);
        },
        function () {
            msg.destroy();
        }
    ]);
};

IDE_Morph.prototype.rawOpenSpritesString = function (str) {
    if (Process.prototype.isCatchingErrors) {
        try {
            this.serializer.loadSprites(str, this);
        } catch (err) {
            this.showMessage('Load failed: ' + err);
        }
    } else {
        this.serializer.loadSprites(str, this);
    }
};

IDE_Morph.prototype.openMediaString = function (str) {
    if (Process.prototype.isCatchingErrors) {
        try {
            this.serializer.loadMedia(str);
        } catch (err) {
            this.showMessage('Load failed: ' + err);
        }
    } else {
        this.serializer.loadMedia(str);
    }
    this.showMessage('Imported Media Module.', 2);
};

IDE_Morph.prototype.openProject = function (name) {
    var str;
    if (name) {
        this.showMessage('opening project\n' + name);
        this.setProjectName(name);
        str = localStorage['-snap-project-' + name];
        this.openProjectString(str);
        location.hash = '#open:' + str;
    }
};

IDE_Morph.prototype.switchToUserMode = function () {
    var world = this.world();

    world.isDevMode = false;
    Process.prototype.isCatchingErrors = true;
    this.controlBar.updateLabel();
    this.isAutoFill = true;
    this.isDraggable = false;
    this.reactToWorldResize(world.bounds.copy());
    this.siblings().forEach(function (morph) {
        if (morph instanceof DialogBoxMorph) {
            world.add(morph); // bring to front
        } else {
            morph.destroy();
        }
    });
    this.flushBlocksCache();
    this.refreshPalette();
    // prevent non-DialogBoxMorphs from being dropped
    // onto the World in user-mode
    world.reactToDropOf = function (morph) {
        if (!(morph instanceof DialogBoxMorph)) {
            world.hand.grab(morph);
        }
    };
    this.showMessage('entering user mode', 1);

};

IDE_Morph.prototype.switchToDevMode = function () {
    var world = this.world();

    world.isDevMode = true;
    Process.prototype.isCatchingErrors = false;
    this.controlBar.updateLabel();
    this.isAutoFill = false;
    this.isDraggable = true;
    this.setExtent(world.extent().subtract(100));
    this.setPosition(world.position().add(20));
    this.flushBlocksCache();
    this.refreshPalette();
    // enable non-DialogBoxMorphs to be dropped
    // onto the World in dev-mode
    delete world.reactToDropOf;
    this.showMessage(
            'entering development mode.\n\n'
            + 'error catching is turned off,\n'
            + 'use the browser\'s web console\n'
            + 'to see error messages.'
    );
};

IDE_Morph.prototype.flushBlocksCache = function (category) {
    // if no category is specified, the whole cache gets flushed
    if (category) {
        this.stage.blocksCache[category] = null;
        this.stage.children.forEach(function (m) {
            if (m instanceof SpriteMorph) {
                m.blocksCache[category] = null;
            }
        });
    } else {
        this.stage.blocksCache = {};
        this.stage.children.forEach(function (m) {
            if (m instanceof SpriteMorph) {
                m.blocksCache = {};
            }
        });
    }
    this.flushPaletteCache(category);
};

IDE_Morph.prototype.flushPaletteCache = function (category) {
    // if no category is specified, the whole cache gets flushed
    if (category) {
        this.stage.paletteCache[category] = null;
        this.stage.children.forEach(function (m) {
            if (m instanceof SpriteMorph) {
                m.paletteCache[category] = null;
            }
        });
    } else {
        this.stage.paletteCache = {};
        this.stage.children.forEach(function (m) {
            if (m instanceof SpriteMorph) {
                m.paletteCache = {};
            }
        });
    }
};

IDE_Morph.prototype.toggleZebraColoring = function () {
    var scripts = [];

    if (!BlockMorph.prototype.zebraContrast) {
        BlockMorph.prototype.zebraContrast = 40;
    } else {
        BlockMorph.prototype.zebraContrast = 0;
    }

    // select all scripts:
    this.stage.children.concat(this.stage).forEach(function (morph) {
        if (morph instanceof SpriteMorph || morph instanceof StageMorph) {
            scripts = scripts.concat(
                morph.scripts.children.filter(function (morph) {
                    return morph instanceof BlockMorph;
                })
            );
        }
    });

    // force-update all scripts:
    scripts.forEach(function (topBlock) {
        topBlock.fixBlockColor(null, true);
    });
};

IDE_Morph.prototype.toggleDynamicInputLabels = function () {
    var projectData;
    SyntaxElementMorph.prototype.dynamicInputLabels = !SyntaxElementMorph.prototype.dynamicInputLabels;
    if (Process.prototype.isCatchingErrors) {
        try {
            projectData = this.serializer.serialize(this.stage);
        } catch (err) {
            this.showMessage('Serialization failed: ' + err);
        }
    } else {
        projectData = this.serializer.serialize(this.stage);
    }
    SpriteMorph.prototype.initBlocks();
    this.spriteBar.tabBar.tabTo('scripts');
    this.createCategories();
    this.createCorralBar();
    this.openProjectString(projectData);
};

IDE_Morph.prototype.toggleBlurredShadows = function () {
    window.useBlurredShadows = !useBlurredShadows;
};

IDE_Morph.prototype.toggleLongFormInputDialog = function () {
    InputSlotDialogMorph.prototype.isLaunchingExpanded = !InputSlotDialogMorph.prototype.isLaunchingExpanded;
    if (InputSlotDialogMorph.prototype.isLaunchingExpanded) {
        this.saveSetting('longform', true);
    } else {
        this.removeSetting('longform');
    }
};

IDE_Morph.prototype.togglePlainPrototypeLabels = function () {
    BlockLabelPlaceHolderMorph.prototype.plainLabel = !BlockLabelPlaceHolderMorph.prototype.plainLabel;
    if (BlockLabelPlaceHolderMorph.prototype.plainLabel) {
        this.saveSetting('plainprototype', true);
    } else {
        this.removeSetting('plainprototype');
    }
};

IDE_Morph.prototype.togglePreferEmptySlotDrops = function () {
    ScriptsMorph.prototype.isPreferringEmptySlots = !ScriptsMorph.prototype.isPreferringEmptySlots;
};

IDE_Morph.prototype.toggleVirtualKeyboard = function () {
    MorphicPreferences.useVirtualKeyboard = !MorphicPreferences.useVirtualKeyboard;
};

IDE_Morph.prototype.toggleInputSliders = function () {
    MorphicPreferences.useSliderForInput = !MorphicPreferences.useSliderForInput;
};

IDE_Morph.prototype.toggleSliderExecute = function () {
    InputSlotMorph.prototype.executeOnSliderEdit = !InputSlotMorph.prototype.executeOnSliderEdit;
};

IDE_Morph.prototype.toggleAppMode = function (appMode) {
    var world = this.world(),
        elements = [
            this.logo,
            this.controlBar.cloudButton,
            this.controlBar.projectButton,
            this.controlBar.settingsButton,
            this.controlBar.stageSizeButton,
            this.corral,
            this.corralBar,
            this.spriteEditor,
            this.spriteBar,
            this.palette,
            this.categories
        ];

    this.isAppMode = isNil(appMode) ? !this.isAppMode : appMode;

    Morph.prototype.trackChanges = false;
    if (this.isAppMode) {
        this.setColor(this.appModeColor);
        this.controlBar.setColor(this.color);
        this.controlBar.appModeButton.refresh();
        elements.forEach(function (e) {
            e.hide();
        });
        world.children.forEach(function (morph) {
            if (morph instanceof DialogBoxMorph) {
                morph.hide();
            }
        });
    } else {
        this.setColor(this.backgroundColor);
        this.controlBar.setColor(this.frameColor);
        elements.forEach(function (e) {
            e.show();
        });
        this.stage.setScale(1);
        // show all hidden dialogs
        world.children.forEach(function (morph) {
            if (morph instanceof DialogBoxMorph) {
                morph.show();
            }
        });
        // prevent scrollbars from showing when morph appears
        world.allChildren().filter(function (c) {
            return c instanceof ScrollFrameMorph;
        }).forEach(function (s) {
            s.adjustScrollBars();
        });
    }
    this.setExtent(this.world().extent()); // resume trackChanges
};

IDE_Morph.prototype.toggleStageSize = function (isSmall) {
    var myself = this,
        world = this.world();

    function zoomIn() {
        myself.stageRatio = 1;
        myself.step = function () {
            myself.stageRatio -= (myself.stageRatio - 0.5) / 2;
            myself.setExtent(world.extent());
            if (myself.stageRatio < 0.6) {
                myself.stageRatio = 0.5;
                myself.setExtent(world.extent());
                delete myself.step;
            }
        };
    }

    function zoomOut() {
        myself.isSmallStage = true;
        myself.stageRatio = 0.5;
        myself.step = function () {
            myself.stageRatio += (1 - myself.stageRatio) / 2;
            myself.setExtent(world.extent());
            if (myself.stageRatio > 0.9) {
                myself.isSmallStage = false;
                myself.setExtent(world.extent());
                myself.controlBar.stageSizeButton.refresh();
                delete myself.step;
            }
        };
    }

    this.isSmallStage = isNil(isSmall) ? !this.isSmallStage : isSmall;
    if (this.isAnimating) {
        if (this.isSmallStage) {
            zoomIn();
        } else {
            zoomOut();
        }
    } else {
        if (this.isSmallStage) {
            this.stageRatio = 0.5;
        }
        this.setExtent(world.extent());
    }
};

IDE_Morph.prototype.createNewProject = function () {
    var myself = this;
    this.confirm(
        'Replace the current project with a new one?',
        'New Project',
        function () {
            myself.newProject();
        }
    );
};

IDE_Morph.prototype.openProjectsBrowser = function () {
    new ProjectDialogMorph(this, 'open').popUp();
};

IDE_Morph.prototype.saveProjectsBrowser = function () {
    if (this.source === 'examples') {
        this.source = 'local'; // cannot save to examples
    }
    new ProjectDialogMorph(this, 'save').popUp();
};

// IDE_Morph localization

IDE_Morph.prototype.languageMenu = function () {
    var menu = new MenuMorph(this),
        world = this.world(),
        pos = this.controlBar.settingsButton.bottomLeft(),
        myself = this;
    SnapTranslator.languages().forEach(function (lang) {
        menu.addItem(
                (SnapTranslator.language === lang ? '\u2713 ' : '    ') +
                SnapTranslator.languageName(lang),
            function () {
                myself.setLanguage(lang);
            }
        );
    });
    menu.popup(world, pos);
};

IDE_Morph.prototype.setLanguage = function (lang, callback) {
    var translation = document.getElementById('language'),
        src = 'lang-' + lang + '.js',
        myself = this;
    SnapTranslator.unload();
    if (translation) {
        document.head.removeChild(translation);
    }
    if (lang === 'en') {
        return this.reflectLanguage('en', callback);
    }
    translation = document.createElement('script');
    translation.id = 'language';
    translation.onload = function () {
        myself.reflectLanguage(lang, callback);
    };
    document.head.appendChild(translation);
    translation.src = src;
};

IDE_Morph.prototype.reflectLanguage = function (lang, callback) {
    var projectData;
    SnapTranslator.language = lang;
    if (!this.loadNewProject) {
        if (Process.prototype.isCatchingErrors) {
            try {
                projectData = this.serializer.serialize(this.stage);
            } catch (err) {
                this.showMessage('Serialization failed: ' + err);
            }
        } else {
            projectData = this.serializer.serialize(this.stage);
        }
    }
    SpriteMorph.prototype.initBlocks();
    this.spriteBar.tabBar.tabTo('scripts');
    this.createCategories();
    this.createCorralBar();
    this.fixLayout();
    if (this.loadNewProject) {
        this.newProject();
    } else {
        this.openProjectString(projectData);
    }
    this.saveSetting('language', lang);
    if (callback) {
        callback.call(this);
    }
};

// IDE_Morph blocks scaling

IDE_Morph.prototype.userSetBlocksScale = function () {
    var myself = this,
        scrpt,
        blck,
        shield,
        sample,
        action;

    scrpt = new CommandBlockMorph();
    scrpt.color = SpriteMorph.prototype.blockColor.motion;
    scrpt.setSpec(localize('build'));
    blck = new CommandBlockMorph();
    blck.color = SpriteMorph.prototype.blockColor.sound;
    blck.setSpec(localize('your own'));
    scrpt.nextBlock(blck);
    blck = new CommandBlockMorph();
    blck.color = SpriteMorph.prototype.blockColor.operators;
    blck.setSpec(localize('blocks'));
    scrpt.bottomBlock().nextBlock(blck);
    /*
     blck = SpriteMorph.prototype.blockForSelector('doForever');
     blck.inputs()[0].nestedBlock(scrpt);
     */

    sample = new FrameMorph();
    sample.acceptsDrops = false;
    sample.texture = this.scriptsPaneTexture;
    sample.setExtent(new Point(250, 180));
    scrpt.setPosition(sample.position().add(10));
    sample.add(scrpt);

    shield = new Morph();
    shield.alpha = 0;
    shield.setExtent(sample.extent());
    shield.setPosition(sample.position());
    sample.add(shield);

    action = function (num) {
        /*
         var c;
         blck.setScale(num);
         blck.drawNew();
         blck.setSpec(blck.blockSpec);
         c = blck.inputs()[0];
         c.setScale(num);
         c.nestedBlock(scrpt);
         */
        scrpt.blockSequence().forEach(function (block) {
            block.setScale(num);
            block.drawNew();
            block.setSpec(block.blockSpec);
        });
    };

    new DialogBoxMorph(
        null,
        function (num) {
            myself.setBlocksScale(Math.min(num, 12));
        }
    ).withKey('zoomBlocks').prompt(
        'Zoom blocks',
        SyntaxElementMorph.prototype.scale.toString(),
        this.world(),
        sample, // pic
        {
            'normal (1x)': 1,
            'demo (1.2x)': 1.2,
            'presentation (1.4x)': 1.4,
            'big (2x)': 2,
            'huge (4x)': 4,
            'giant (8x)': 8,
            'monstrous (10x)': 10
        },
        false, // read only?
        true, // numeric
        1, // slider min
        12, // slider max
        action // slider action
    );
};

IDE_Morph.prototype.setBlocksScale = function (num) {
    var projectData;
    if (Process.prototype.isCatchingErrors) {
        try {
            projectData = this.serializer.serialize(this.stage);
        } catch (err) {
            this.showMessage('Serialization failed: ' + err);
        }
    } else {
        projectData = this.serializer.serialize(this.stage);
    }
    SyntaxElementMorph.prototype.setScale(num);
    CommentMorph.prototype.refreshScale();
    SpriteMorph.prototype.initBlocks();
    this.spriteBar.tabBar.tabTo('scripts');
    this.createCategories();
    this.createCorralBar();
    this.fixLayout();
    this.openProjectString(projectData);
    this.saveSetting('zoom', num);
};

// IDE_Morph stage size manipulation

IDE_Morph.prototype.userSetStageSize = function () {
    new DialogBoxMorph(
        this,
        this.setStageExtent,
        this
    ).promptVector(
        "Stage size",
        StageMorph.prototype.dimensions,
        new Point(480, 360),
        'Stage width',
        'Stage height',
        this.world(),
        null, // pic
        null // msg
    );
};

IDE_Morph.prototype.setStageExtent = function (aPoint) {
    var myself = this,
        world = this.world(),
        ext = aPoint.max(new Point(480, 180));

    function zoom() {
        myself.step = function () {
            var delta = ext.subtract(
                StageMorph.prototype.dimensions
            ).divideBy(2);
            if (delta.abs().lt(new Point(5, 5))) {
                StageMorph.prototype.dimensions = ext;
                delete myself.step;
            } else {
                StageMorph.prototype.dimensions =
                    StageMorph.prototype.dimensions.add(delta);
            }
            myself.stage.setExtent(StageMorph.prototype.dimensions);
            myself.stage.clearPenTrails();
            myself.fixLayout();
            this.setExtent(world.extent());
        };
    }

    this.stageRatio = 1;
    this.isSmallStage = false;
    this.controlBar.stageSizeButton.refresh();
    this.setExtent(world.extent());
    if (this.isAnimating) {
        zoom();
    } else {
        StageMorph.prototype.dimensions = ext;
        this.stage.setExtent(StageMorph.prototype.dimensions);
        this.stage.clearPenTrails();
        this.fixLayout();
        this.setExtent(world.extent());
    }
};

// IDE_Morph cloud interface

IDE_Morph.prototype.initializeCloud = function () {
    var myself = this,
        world = this.world();
    new DialogBoxMorph(
        null,
        function (user) {
            var pwh = hex_sha512(user.password),
                str;
            SnapCloud.login(
                user.username,
                pwh,
                function () {
                    if (user.choice) {
                        str = SnapCloud.encodeDict(
                            {
                                username: user.username,
                                password: pwh
                            }
                        );
                        localStorage['-snap-user'] = str;
                    }
                    myself.source = 'cloud';
                    myself.showMessage('now connected.', 2);
                },
                myself.cloudError()
            );
        }
    ).withKey('cloudlogin').promptCredentials(
        'Sign in',
        'login',
        null,
        null,
        null,
        null,
        'stay signed in on this computer\nuntil logging out',
        world,
        myself.cloudIcon(),
        myself.cloudMsg
    );
};

IDE_Morph.prototype.createCloudAccount = function () {
    var myself = this,
        world = this.world();
    /*
     // force-logout, commented out for now:
     delete localStorage['-snap-user'];
     SnapCloud.clear();
     */
    new DialogBoxMorph(
        null,
        function (user) {
            SnapCloud.signup(
                user.username,
                user.email,
                function (txt, title) {
                    new DialogBoxMorph().inform(
                        title,
                            txt +
                            '.\n\nAn e-mail with your password\n' +
                            'has been sent to the address provided',
                        world,
                        myself.cloudIcon(null, new Color(0, 180, 0))
                    );
                },
                myself.cloudError()
            );
        }
    ).withKey('cloudsignup').promptCredentials(
        'Sign up',
        'signup',
        'http://snap.berkeley.edu/tos.html',
        'Terms of Service...',
        'http://snap.berkeley.edu/privacy.html',
        'Privacy...',
        'I have read and agree\nto the Terms of Service',
        world,
        myself.cloudIcon(),
        myself.cloudMsg
    );
};

IDE_Morph.prototype.resetCloudPassword = function () {
    var myself = this,
        world = this.world();
    /*
     // force-logout, commented out for now:
     delete localStorage['-snap-user'];
     SnapCloud.clear();
     */
    new DialogBoxMorph(
        null,
        function (user) {
            SnapCloud.resetPassword(
                user.username,
                function (txt, title) {
                    new DialogBoxMorph().inform(
                        title,
                            txt +
                            '.\n\nAn e-mail with a link to\n' +
                            'reset your password\n' +
                            'has been sent to the address provided',
                        world,
                        myself.cloudIcon(null, new Color(0, 180, 0))
                    );
                },
                myself.cloudError()
            );
        }
    ).withKey('cloudresetpassword').promptCredentials(
        'Reset password',
        'resetPassword',
        null,
        null,
        null,
        null,
        null,
        world,
        myself.cloudIcon(),
        myself.cloudMsg
    );
};

IDE_Morph.prototype.changeCloudPassword = function () {
    var myself = this,
        world = this.world();
    new DialogBoxMorph(
        null,
        function (user) {
            SnapCloud.changePassword(
                user.oldpassword,
                user.password,
                function () {
                    myself.logout();
                    myself.showMessage('password has been changed.', 2);
                },
                myself.cloudError()
            );
        }
    ).withKey('cloudpassword').promptCredentials(
        'Change Password',
        'changePassword',
        null,
        null,
        null,
        null,
        null,
        world,
        myself.cloudIcon(),
        myself.cloudMsg
    );
};

IDE_Morph.prototype.logout = function () {
    var myself = this;
    delete localStorage['-snap-user'];
    SnapCloud.logout(
        function () {
            SnapCloud.clear();
            myself.showMessage('disconnected.', 2);
        },
        function () {
            SnapCloud.clear();
            myself.showMessage('disconnected.', 2);
        }
    );
};

IDE_Morph.prototype.saveProjectToCloud = function (name) {
    var myself = this;
    if (name) {
        this.showMessage('Saving project\nto the cloud...');
        this.setProjectName(name);
        SnapCloud.saveProject(
            this,
            function () {
                myself.showMessage('saved.', 2);
            },
            this.cloudError()
        );
    }
};

IDE_Morph.prototype.exportProjectMedia = function (name) {
    var menu, media;
    this.serializer.isCollectingMedia = true;
    if (name) {
        this.setProjectName(name);
        if (Process.prototype.isCatchingErrors) {
            try {
                menu = this.showMessage('Exporting');
                encodeURIComponent(
                    this.serializer.serialize(this.stage)
                );
                media = encodeURIComponent(
                    this.serializer.mediaXML(name)
                );
                window.open('data:text/xml,' + media);
                menu.destroy();
                this.showMessage('Exported!', 1);
            } catch (err) {
                this.serializer.isCollectingMedia = false;
                this.showMessage('Export failed: ' + err);
            }
        } else {
            menu = this.showMessage('Exporting');
            encodeURIComponent(
                this.serializer.serialize(this.stage)
            );
            media = encodeURIComponent(
                this.serializer.mediaXML()
            );
            window.open('data:text/xml,' + media);
            menu.destroy();
            this.showMessage('Exported!', 1);
        }
    }
    this.serializer.isCollectingMedia = false;
    this.serializer.flushMedia();
    // this.hasChangedMedia = false;
};

IDE_Morph.prototype.exportProjectNoMedia = function (name) {
    var menu, str;
    this.serializer.isCollectingMedia = true;
    if (name) {
        this.setProjectName(name);
        if (Process.prototype.isCatchingErrors) {
            try {
                menu = this.showMessage('Exporting');
                str = encodeURIComponent(
                    this.serializer.serialize(this.stage)
                );
                window.open('data:text/xml,' + str);
                menu.destroy();
                this.showMessage('Exported!', 1);
            } catch (err) {
                this.serializer.isCollectingMedia = false;
                this.showMessage('Export failed: ' + err);
            }
        } else {
            menu = this.showMessage('Exporting');
            str = encodeURIComponent(
                this.serializer.serialize(this.stage)
            );
            window.open('data:text/xml,' + str);
            menu.destroy();
            this.showMessage('Exported!', 1);
        }
    }
    this.serializer.isCollectingMedia = false;
    this.serializer.flushMedia();
};

IDE_Morph.prototype.exportProjectAsCloudData = function (name) {
    var menu, str, media, dta;
    this.serializer.isCollectingMedia = true;
    if (name) {
        this.setProjectName(name);
        if (Process.prototype.isCatchingErrors) {
            try {
                menu = this.showMessage('Exporting');
                str = encodeURIComponent(
                    this.serializer.serialize(this.stage)
                );
                media = encodeURIComponent(
                    this.serializer.mediaXML(name)
                );
                dta = encodeURIComponent('<snapdata>')
                    + str
                    + media
                    + encodeURIComponent('</snapdata>');
                window.open('data:text/xml,' + dta);
                menu.destroy();
                this.showMessage('Exported!', 1);
            } catch (err) {
                this.serializer.isCollectingMedia = false;
                this.showMessage('Export failed: ' + err);
            }
        } else {
            menu = this.showMessage('Exporting');
            str = encodeURIComponent(
                this.serializer.serialize(this.stage)
            );
            media = encodeURIComponent(
                this.serializer.mediaXML()
            );
            dta = encodeURIComponent('<snapdata>')
                + str
                + media
                + encodeURIComponent('</snapdata>');
            window.open('data:text/xml,' + dta);
            menu.destroy();
            this.showMessage('Exported!', 1);
        }
    }
    this.serializer.isCollectingMedia = false;
    this.serializer.flushMedia();
    // this.hasChangedMedia = false;
};

IDE_Morph.prototype.cloudAcknowledge = function () {
    var myself = this;
    return function (responseText, url) {
        nop(responseText);
        new DialogBoxMorph().inform(
            'Cloud Connection',
                'Successfully connected to:\n'
                + 'http://'
                + url,
            myself.world(),
            myself.cloudIcon(null, new Color(0, 180, 0))
        );
    };
};

IDE_Morph.prototype.cloudResponse = function () {
    var myself = this;
    return function (responseText, url) {
        var response = responseText;
        if (response.length > 50) {
            response = response.substring(0, 50) + '...';
        }
        new DialogBoxMorph().inform(
            'Snap!Cloud',
                'http://'
                + url + ':\n\n'
                + 'responds:\n'
                + response,
            myself.world(),
            myself.cloudIcon(null, new Color(0, 180, 0))
        );
    };
};

IDE_Morph.prototype.cloudError = function () {
    var myself = this;

    function getURL(url) {
        try {
            var request = new XMLHttpRequest();
            request.open('GET', url, false);
            request.send();
            if (request.status === 200) {
                return request.responseText;
            }
            return null;
        } catch (err) {
            return null;
        }
    }

    return function (responseText, url) {
        // first, try to find out an explanation for the error
        // and notify the user about it,
        // if none is found, show an error dialog box
        var response = responseText,
            explanation = getURL('http://snap.berkeley.edu/cloudmsg.txt');
        if (myself.shield) {
            myself.shield.destroy();
            myself.shield = null;
        }
        if (explanation) {
            myself.showMessage(explanation);
            return;
        }
        if (response.length > 50) {
            response = response.substring(0, 50) + '...';
        }
        new DialogBoxMorph().inform(
            'Snap!Cloud',
                (url ? url + '\n' : '')
                + response,
            myself.world(),
            myself.cloudIcon(null, new Color(180, 0, 0))
        );
    };
};

IDE_Morph.prototype.cloudIcon = function (height, color) {
    var clr = color || DialogBoxMorph.prototype.titleBarColor,
        isFlat = MorphicPreferences.isFlat,
        icon = new SymbolMorph(
            isFlat ? 'cloud' : 'cloudGradient',
                height || 50,
            clr,
            isFlat ? null : new Point(-1, -1),
            clr.darker(50)
        );
    if (!isFlat) {
        icon.addShadow(new Point(1, 1), 1, clr.lighter(95));
    }
    return icon;
};

IDE_Morph.prototype.setCloudURL = function () {
    new DialogBoxMorph(
        null,
        function (url) {
            SnapCloud.url = url;
        }
    ).withKey('cloudURL').prompt(
        'Cloud URL',
        SnapCloud.url,
        this.world(),
        null,
        {
            'Snap!Cloud': 'https://snapcloud.miosoft.com/miocon/app/' +
                'login?_app=SnapCloud',
            'local network lab': '192.168.2.107:8087/miocon/app/login?_app=SnapCloud',
            'local network office': '192.168.186.146:8087/miocon/app/login?_app=SnapCloud',
            'localhost dev': 'localhost/miocon/app/login?_app=SnapCloud'
        }
    );
};

// IDE_Morph synchronous Http data fetching

IDE_Morph.prototype.getURL = function (url) {
    var request = new XMLHttpRequest(),
        myself = this;
    try {
        request.open('GET', url, false);
        request.send();
        if (request.status === 200) {
            return request.responseText;
        }
        throw new Error('unable to retrieve ' + url);
    } catch (err) {
        myself.showMessage(err);
        return;
    }
};

IDE_Morph.prototype.getURLsbeOrRelative = function (url) {
    var request = new XMLHttpRequest(),
        myself = this;
    try {
        request.open('GET', 'http://snap.berkeley.edu/snapsource/' +
            url, false);
        request.send();
        if (request.status === 200) {
            return request.responseText;
        }
        return myself.getURL(url);
    } catch (err) {
        myself.showMessage(err);
        return;
    }
};

// IDE_Morph user dialog shortcuts

IDE_Morph.prototype.showMessage = function (message, secs) {
    var m = new MenuMorph(null, message),
        intervalHandle;
    m.popUpCenteredInWorld(this.world());
    if (secs) {
        intervalHandle = setInterval(function () {
            m.destroy();
            clearInterval(intervalHandle);
        }, secs * 1000);
    }
    return m;
};

IDE_Morph.prototype.inform = function (title, message) {
    new DialogBoxMorph().inform(
        title,
        localize(message),
        this.world()
    );
};

IDE_Morph.prototype.confirm = function (message, title, action) {
    new DialogBoxMorph(null, action).askYesNo(
        title,
        localize(message),
        this.world()
    );
};

// xinni: popup with <warning image> and <yes/no buttons>
IDE_Morph.prototype.imageConfirm = function(message, action) {

    var pic = newCanvas(new Point(
        129, 123
    ));

    ctx = pic.getContext("2d");
    img = new Image();
    img.src = '../images/notification.png';
    img.onload = function () {
        // create pattern
        var ptrn = ctx.createPattern(img, 'repeat'); // Create a pattern with this image, and set it to "repeat".
        ctx.fillStyle = ptrn;
        ctx.fillRect(0, 0, pic.width, pic.height);
    };

    new DialogBoxMorph(null, action).askYesNo("Are you sure?", localize(message),this.world(), pic);

};

// xinni: failure message
IDE_Morph.prototype.informFailure = function(message) {

    var pic = newCanvas(new Point(
        129, 123
    ));

    ctx = pic.getContext("2d");
    img = new Image();
    img.src = '../images/failure.png';
    img.onload = function () {
        // create pattern
        var ptrn = ctx.createPattern(img, 'repeat'); // Create a pattern with this image, and set it to "repeat".
        ctx.fillStyle = ptrn;
        ctx.fillRect(0, 0, pic.width, pic.height);
    };

    new DialogBoxMorph(null, null).inform("Oops", localize(message), this.world(), pic);

};



// xinni: success message
IDE_Morph.prototype.informSuccess = function(message) {

    var pic = newCanvas(new Point(
        129, 123
    ));

    ctx = pic.getContext("2d");
    img = new Image();
    img.src = '../images/success.png';
    img.onload = function () {
        // create pattern
        var ptrn = ctx.createPattern(img, 'repeat'); // Create a pattern with this image, and set it to "repeat".
        ctx.fillStyle = ptrn;
        ctx.fillRect(0, 0, pic.width, pic.height);
    };

    new DialogBoxMorph(null, null).inform("Success", localize(message), this.world(), pic);

};

IDE_Morph.prototype.prompt = function (message, callback, choices, key) {
    (new DialogBoxMorph(null, callback)).withKey(key).prompt(
        message,
        '',
        this.world(),
        null,
        choices
    );
};

// ProjectDialogMorph ////////////////////////////////////////////////////

// ProjectDialogMorph inherits from DialogBoxMorph:

ProjectDialogMorph.prototype = new DialogBoxMorph();
ProjectDialogMorph.prototype.constructor = ProjectDialogMorph;
ProjectDialogMorph.uber = DialogBoxMorph.prototype;
ProjectDialogMorph.className = 'ProjectDialogMorph';
// ProjectDialogMorph instance creation:

function ProjectDialogMorph(ide, label) {
    this.init(ide, label);
}

ProjectDialogMorph.prototype.init = function (ide, task) {
    var myself = this;

    // additional properties:
    this.ide = ide;
    this.task = task || 'open'; // String describing what do do (open, save)
    this.source = ide.source || 'local'; // or 'cloud' or 'examples'
    this.projectList = []; // [{name: , thumb: , notes:}]

    this.handle = null;
    this.srcBar = null;
    this.nameField = null;
    this.listField = null;
    this.preview = null;
    this.notesText = null;
    this.notesField = null;
    this.deleteButton = null;
    this.shareButton = null;
    this.unshareButton = null;

    // initialize inherited properties:
    ProjectDialogMorph.uber.init.call(
        this,
        this, // target
        null, // function
        null // environment
    );

    // override inherited properites:
    this.labelString = this.task === 'save' ? 'Save Project' : 'Open Project';
    this.createLabel();
    this.key = 'project' + task;

    // build contents
    this.buildContents();
    this.onNextStep = function () { // yield to show "updating" message
        myself.setSource(myself.source);
    };
};

ProjectDialogMorph.prototype.buildContents = function () {
    var thumbnail, notification;

    this.addBody(new Morph());
    this.body.color = this.color;

    this.srcBar = new AlignmentMorph('column', this.padding / 2);

    if (this.ide.cloudMsg) {
        notification = new TextMorph(
            this.ide.cloudMsg,
            10,
            null, // style
            false, // bold
            null, // italic
            null, // alignment
            null, // width
            null, // font name
            new Point(1, 1), // shadow offset
            new Color(255, 255, 255) // shadowColor
        );
        notification.refresh = nop;
        this.srcBar.add(notification);
    }

    this.addSourceButton('cloud', localize('Cloud'), 'cloud');
    this.addSourceButton('local', localize('Browser'), 'storage');
    if (this.task === 'open') {
        this.addSourceButton('examples', localize('Examples'), 'poster');
    }
    this.srcBar.fixLayout();
    this.body.add(this.srcBar);

    if (this.task === 'save') {
        this.nameField = new InputFieldMorph(this.ide.projectName);
        this.body.add(this.nameField);
    }

    this.listField = new ListMorph([]);
    this.fixListFieldItemColors();
    this.listField.fixLayout = nop;
    this.listField.edge = InputFieldMorph.prototype.edge;
    this.listField.fontSize = InputFieldMorph.prototype.fontSize;
    this.listField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.listField.contrast = InputFieldMorph.prototype.contrast;
    this.listField.drawNew = InputFieldMorph.prototype.drawNew;
    this.listField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    this.body.add(this.listField);

    this.preview = new Morph();
    this.preview.fixLayout = nop;
    this.preview.edge = InputFieldMorph.prototype.edge;
    this.preview.fontSize = InputFieldMorph.prototype.fontSize;
    this.preview.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.preview.contrast = InputFieldMorph.prototype.contrast;
    this.preview.drawNew = function () {
        InputFieldMorph.prototype.drawNew.call(this);
        if (this.texture) {
            this.drawTexture(this.texture);
        }
    };
    this.preview.drawCachedTexture = function () {
        var context = this.image.getContext('2d');
        context.drawImage(this.cachedTexture, this.edge, this.edge);
        this.changed();
    };
    this.preview.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;
    this.preview.setExtent(
        this.ide.serializer.thumbnailSize.add(this.preview.edge * 2)
    );

    this.body.add(this.preview);
    this.preview.drawNew();
    if (this.task === 'save') {
        thumbnail = this.ide.stage.thumbnail(
            SnapSerializer.prototype.thumbnailSize
        );
        this.preview.texture = null;
        this.preview.cachedTexture = thumbnail;
        this.preview.drawCachedTexture();
    }

    this.notesField = new ScrollFrameMorph();
    this.notesField.fixLayout = nop;

    this.notesField.edge = InputFieldMorph.prototype.edge;
    this.notesField.fontSize = InputFieldMorph.prototype.fontSize;
    this.notesField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.notesField.contrast = InputFieldMorph.prototype.contrast;
    this.notesField.drawNew = InputFieldMorph.prototype.drawNew;
    this.notesField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    this.notesField.acceptsDrops = false;
    this.notesField.contents.acceptsDrops = false;

    if (this.task === 'open') {
        this.notesText = new TextMorph('');
    } else { // 'save'
        this.notesText = new TextMorph(this.ide.projectNotes);
        this.notesText.isEditable = true;
        this.notesText.enableSelecting();
    }

    this.notesField.isTextLineWrapping = true;
    this.notesField.padding = 3;
    this.notesField.setContents(this.notesText);
    this.notesField.setWidth(this.preview.width());

    this.body.add(this.notesField);

    if (this.task === 'open') {
        this.addButton('openProject', 'Open');
        this.action = 'openProject';
    } else { // 'save'
        this.addButton('saveProject', 'Save');
        this.action = 'saveProject';
    }
    this.shareButton = this.addButton('shareProject', 'Share');
    this.unshareButton = this.addButton('unshareProject', 'Unshare');
    this.shareButton.hide();
    this.unshareButton.hide();
    this.deleteButton = this.addButton('deleteProject', 'Delete');
    this.addButton('cancel', 'Cancel');

    if (notification) {
        this.setExtent(new Point(455, 335).add(notification.extent()));
    } else {
        this.setExtent(new Point(455, 335));
    }
    this.fixLayout();

};

ProjectDialogMorph.prototype.popUp = function (wrrld) {
    var world = wrrld || this.ide.world();
    if (world) {
        ProjectDialogMorph.uber.popUp.call(this, world);
        this.handle = new HandleMorph(
            this,
            350,
            300,
            this.corner,
            this.corner
        );
    }
};

// ProjectDialogMorph source buttons

ProjectDialogMorph.prototype.addSourceButton = function (source, label, symbol) {
    var myself = this,
        lbl1 = new StringMorph(
            label,
            10,
            null,
            true,
            null,
            null,
            new Point(1, 1),
            new Color(255, 255, 255)
        ),
        lbl2 = new StringMorph(
            label,
            10,
            null,
            true,
            null,
            null,
            new Point(-1, -1),
            this.titleBarColor.darker(50),
            new Color(255, 255, 255)
        ),
        l1 = new Morph(),
        l2 = new Morph(),
        button;

    lbl1.add(new SymbolMorph(
        symbol,
        24,
        this.titleBarColor.darker(20),
        new Point(1, 1),
        this.titleBarColor.darker(50)
    ));
    lbl1.children[0].setCenter(lbl1.center());
    lbl1.children[0].setBottom(lbl1.top() - this.padding / 2);

    l1.image = lbl1.fullImage();
    l1.bounds = lbl1.fullBounds();

    lbl2.add(new SymbolMorph(
        symbol,
        24,
        new Color(255, 255, 255),
        new Point(-1, -1),
        this.titleBarColor.darker(50)
    ));
    lbl2.children[0].setCenter(lbl2.center());
    lbl2.children[0].setBottom(lbl2.top() - this.padding / 2);

    l2.image = lbl2.fullImage();
    l2.bounds = lbl2.fullBounds();

    button = new ToggleButtonMorph(
        null, //colors,
        myself, // the ProjectDialog is the target
        function () { // action
            myself.setSource(source);
        },
        [l1, l2],
        function () {  // query
            return myself.source === source;
        }
    );

    button.corner = this.buttonCorner;
    button.edge = this.buttonEdge;
    button.outline = this.buttonOutline;
    button.outlineColor = this.buttonOutlineColor;
    button.outlineGradient = this.buttonOutlineGradient;
    button.labelMinExtent = new Point(60, 0);
    button.padding = this.buttonPadding;
    button.contrast = this.buttonContrast;
    button.pressColor = this.titleBarColor.darker(20);

    button.drawNew();
    button.fixLayout();
    button.refresh();
    this.srcBar.add(button);
};

// ProjectDialogMorph list field control

ProjectDialogMorph.prototype.fixListFieldItemColors = function () {
    // remember to always fixLayout() afterwards for the changes
    // to take effect
    var myself = this;
    this.listField.contents.children[0].alpha = 0;
    this.listField.contents.children[0].children.forEach(function (item) {
        item.pressColor = myself.titleBarColor.darker(20);
        item.color = new Color(0, 0, 0, 0);
        item.noticesTransparentClick = true;
    });
};

// ProjectDialogMorph ops

ProjectDialogMorph.prototype.setSource = function (source) {
    var myself = this,
        msg;

    this.source = source; //this.task === 'save' ? 'local' : source;
    this.srcBar.children.forEach(function (button) {
        button.refresh();
    });
    switch (this.source) {
        case 'cloud':
            msg = myself.ide.showMessage('Updating\nproject list...');
            this.projectList = [];
            SnapCloud.getProjectList(
                function (projectList) {
                    myself.installCloudProjectList(projectList);
                    msg.destroy();
                },
                function (err, lbl) {
                    msg.destroy();
                    myself.ide.cloudError().call(null, err, lbl);
                }
            );
            return;
        case 'examples':
            this.projectList = this.getExamplesProjectList();
            break;
        case 'local':
            this.projectList = this.getLocalProjectList();
            break;
    }

    this.listField.destroy();
    this.listField = new ListMorph(
        this.projectList,
            this.projectList.length > 0 ?
            function (element) {
                return element.name;
            } : null,
        null,
        function () {
            myself.ok();
        }
    );

    this.fixListFieldItemColors();
    this.listField.fixLayout = nop;
    this.listField.edge = InputFieldMorph.prototype.edge;
    this.listField.fontSize = InputFieldMorph.prototype.fontSize;
    this.listField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.listField.contrast = InputFieldMorph.prototype.contrast;
    this.listField.drawNew = InputFieldMorph.prototype.drawNew;
    this.listField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    if (this.source === 'local') {
        this.listField.action = function (item) {
            var src, xml;

            if (item === undefined) {
                return;
            }
            if (myself.nameField) {
                myself.nameField.setContents(item.name || '');
            }
            if (myself.task === 'open') {

                src = localStorage['-snap-project-' + item.name];
                xml = myself.ide.serializer.parse(src);

                myself.notesText.text = xml.childNamed('notes').contents
                    || '';
                myself.notesText.drawNew();
                myself.notesField.contents.adjustBounds();
                myself.preview.texture = xml.childNamed('thumbnail').contents
                    || null;
                myself.preview.cachedTexture = null;
                myself.preview.drawNew();
            }
            myself.edit();
        };
    } else { // 'examples', 'cloud' is initialized elsewhere
        this.listField.action = function (item) {
            var src, xml;
            if (item === undefined) {
                return;
            }
            if (myself.nameField) {
                myself.nameField.setContents(item.name || '');
            }
            src = myself.ide.getURL(
                    'http://snap.berkeley.edu/snapsource/Examples/' +
                    item.name + '.xml'
            );

            xml = myself.ide.serializer.parse(src);
            myself.notesText.text = xml.childNamed('notes').contents
                || '';
            myself.notesText.drawNew();
            myself.notesField.contents.adjustBounds();
            myself.preview.texture = xml.childNamed('thumbnail').contents
                || null;
            myself.preview.cachedTexture = null;
            myself.preview.drawNew();
            myself.edit();
        };
    }
    this.body.add(this.listField);
    this.shareButton.hide();
    this.unshareButton.hide();
    if (this.source === 'local') {
        this.deleteButton.show();
    } else { // examples
        this.deleteButton.hide();
    }
    this.buttons.fixLayout();
    this.fixLayout();
    if (this.task === 'open') {
        this.clearDetails();
    }
};

ProjectDialogMorph.prototype.getLocalProjectList = function () {
    var stored, name, dta,
        projects = [];
    for (stored in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, stored)
            && stored.substr(0, 14) === '-snap-project-') {
            name = stored.substr(14);
            dta = {
                name: name,
                thumb: null,
                notes: null
            };
            projects.push(dta);
        }
    }
    projects.sort(function (x, y) {
        return x.name < y.name ? -1 : 1;
    });
    return projects;
};

ProjectDialogMorph.prototype.getExamplesProjectList = function () {
    var dir,
        projects = [];

    dir = this.ide.getURL('http://snap.berkeley.edu/snapsource/Examples/');
    dir.split('\n').forEach(
        function (line) {
            var startIdx = line.search(new RegExp('href=".*xml"')),
                endIdx,
                name,
                dta;
            if (startIdx > 0) {
                endIdx = line.search(new RegExp('.xml'));
                name = line.substring(startIdx + 6, endIdx);
                dta = {
                    name: name,
                    thumb: null,
                    notes: null
                };
                projects.push(dta);
            }
        }
    );
    projects.sort(function (x, y) {
        return x.name < y.name ? -1 : 1;
    });
    return projects;
};

ProjectDialogMorph.prototype.installCloudProjectList = function (pl) {
    var myself = this;
    this.projectList = pl || [];
    this.projectList.sort(function (x, y) {
        return x.ProjectName < y.ProjectName ? -1 : 1;
    });

    this.listField.destroy();
    this.listField = new ListMorph(
        this.projectList,
            this.projectList.length > 0 ?
            function (element) {
                return element.ProjectName;
            } : null,
        [ // format: display shared project names bold
            [
                'bold',
                function (proj) {
                    return proj.Public === 'true';
                }
            ]
        ],
        function () {
            myself.ok();
        }
    );
    this.fixListFieldItemColors();
    this.listField.fixLayout = nop;
    this.listField.edge = InputFieldMorph.prototype.edge;
    this.listField.fontSize = InputFieldMorph.prototype.fontSize;
    this.listField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.listField.contrast = InputFieldMorph.prototype.contrast;
    this.listField.drawNew = InputFieldMorph.prototype.drawNew;
    this.listField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    this.listField.action = function (item) {
        if (item === undefined) {
            return;
        }
        if (myself.nameField) {
            myself.nameField.setContents(item.ProjectName || '');
        }
        if (myself.task === 'open') {
            myself.notesText.text = item.Notes || '';
            myself.notesText.drawNew();
            myself.notesField.contents.adjustBounds();
            myself.preview.texture = item.Thumbnail || null;
            myself.preview.cachedTexture = null;
            myself.preview.drawNew();
            (new SpeechBubbleMorph(new TextMorph(
                    localize('last changed') + '\n' + item.Updated,
                null,
                null,
                null,
                null,
                'center'
            ))).popUp(
                myself.world(),
                myself.preview.rightCenter().add(new Point(2, 0))
            );
        }
        if (item.Public === 'true') {
            myself.shareButton.hide();
            myself.unshareButton.show();
        } else {
            myself.unshareButton.hide();
            myself.shareButton.show();
        }
        myself.buttons.fixLayout();
        myself.fixLayout();
        myself.edit();
    };
    this.body.add(this.listField);
    this.shareButton.show();
    this.unshareButton.hide();
    this.deleteButton.show();
    this.buttons.fixLayout();
    this.fixLayout();
    if (this.task === 'open') {
        this.clearDetails();
    }
};

ProjectDialogMorph.prototype.clearDetails = function () {
    this.notesText.text = '';
    this.notesText.drawNew();
    this.notesField.contents.adjustBounds();
    this.preview.texture = null;
    this.preview.cachedTexture = null;
    this.preview.drawNew();
};

ProjectDialogMorph.prototype.openProject = function () {
    var proj = this.listField.selected,
        src;
    if (!proj) {
        return;
    }
    this.ide.source = this.source;
    if (this.source === 'cloud') {
        this.openCloudProject(proj);
    } else if (this.source === 'examples') {
        src = this.ide.getURL(
                'http://snap.berkeley.edu/snapsource/Examples/' +
                proj.name + '.xml'
        );
        this.ide.openProjectString(src);
        this.destroy();
    } else { // 'local'
        this.ide.openProject(proj.name);
        this.destroy();
    }
};

ProjectDialogMorph.prototype.openCloudProject = function (project) {
    var myself = this;
    myself.ide.nextSteps([
        function () {
            myself.ide.showMessage('Fetching project\nfrom the cloud...');
        },
        function () {
            myself.rawOpenCloudProject(project);
        }
    ]);
};

ProjectDialogMorph.prototype.rawOpenCloudProject = function (proj) {
    var myself = this;
    SnapCloud.reconnect(
        function () {
            SnapCloud.callService(
                'getProject',
                function (response) {
                    SnapCloud.disconnect();
                    myself.ide.source = 'cloud';
                    myself.ide.droppedText(response[0].SourceCode);
                    if (proj.Public === 'true') {
                        location.hash = '#present:Username=' +
                            encodeURIComponent(SnapCloud.username) +
                            '&ProjectName=' +
                            encodeURIComponent(proj.ProjectName);
                    }
                },
                myself.ide.cloudError(),
                [proj.ProjectName]
            );
        },
        myself.ide.cloudError()
    );
    this.destroy();
};

ProjectDialogMorph.prototype.saveProject = function () {
    var name = this.nameField.contents().text.text,
        notes = this.notesText.text,
        myself = this;

    this.ide.projectNotes = notes || this.ide.projectNotes;
    if (name) {
        if (this.source === 'cloud') {
            if (detect(
                this.projectList,
                function (item) {
                    return item.ProjectName === name;
                }
            )) {
                this.ide.confirm(
                        localize(
                            'Are you sure you want to replace'
                        ) + '\n"' + name + '"?',
                    'Replace Project',
                    function () {
                        myself.ide.setProjectName(name);
                        myself.saveCloudProject();
                    }
                );
            } else {
                this.ide.setProjectName(name);
                myself.saveCloudProject();
            }
        } else { // 'local'
            if (detect(
                this.projectList,
                function (item) {
                    return item.name === name;
                }
            )) {
                this.ide.confirm(
                        localize(
                            'Are you sure you want to replace'
                        ) + '\n"' + name + '"?',
                    'Replace Project',
                    function () {
                        myself.ide.setProjectName(name);
                        myself.ide.source = 'local';
                        myself.ide.saveProject(name);
                        myself.destroy();
                    }
                );
            } else {
                this.ide.setProjectName(name);
                myself.ide.source = 'local';
                this.ide.saveProject(name);
                this.destroy();
            }
        }
    }
};

ProjectDialogMorph.prototype.saveCloudProject = function () {
    var myself = this;
    this.ide.showMessage('Saving project\nto the cloud...');
    SnapCloud.saveProject(
        this.ide,
        function () {
            myself.ide.source = 'cloud';
            myself.ide.showMessage('saved.', 2);
        },
        this.ide.cloudError()
    );
    this.destroy();
};

ProjectDialogMorph.prototype.deleteProject = function () {
    var myself = this,
        proj,
        idx,
        name;

    if (this.source === 'cloud') {
        proj = this.listField.selected;
        if (proj) {
            this.ide.confirm(
                    localize(
                        'Are you sure you want to delete'
                    ) + '\n"' + proj.ProjectName + '"?',
                'Delete Project',
                function () {
                    SnapCloud.reconnect(
                        function () {
                            SnapCloud.callService(
                                'deleteProject',
                                function () {
                                    SnapCloud.disconnect();
                                    myself.ide.hasChangedMedia = true;
                                    idx = myself.projectList.indexOf(proj);
                                    myself.projectList.splice(idx, 1);
                                    myself.installCloudProjectList(
                                        myself.projectList
                                    ); // refresh list
                                },
                                myself.ide.cloudError(),
                                [proj.ProjectName]
                            );
                        },
                        myself.ide.cloudError()
                    );
                }
            );
        }
    } else { // 'local, examples'
        if (this.listField.selected) {
            name = this.listField.selected.name;
            this.ide.confirm(
                    localize(
                        'Are you sure you want to delete'
                    ) + '\n"' + name + '"?',
                'Delete Project',
                function () {
                    delete localStorage['-snap-project-' + name];
                    myself.setSource(myself.source); // refresh list
                }
            );
        }
    }
};

ProjectDialogMorph.prototype.shareProject = function () {
    var myself = this,
        proj = this.listField.selected,
        entry = this.listField.active;

    if (proj) {
        this.ide.confirm(
                localize(
                    'Are you sure you want to publish'
                ) + '\n"' + proj.ProjectName + '"?',
            'Share Project',
            function () {
                myself.ide.showMessage('sharing\nproject...');
                SnapCloud.reconnect(
                    function () {
                        SnapCloud.callService(
                            'publishProject',
                            function () {
                                SnapCloud.disconnect();
                                proj.Public = 'true';
                                myself.unshareButton.show();
                                myself.shareButton.hide();
                                entry.label.isBold = true;
                                entry.label.drawNew();
                                entry.label.changed();
                                myself.buttons.fixLayout();
                                myself.drawNew();
                                myself.ide.showMessage('shared.', 2);
                            },
                            myself.ide.cloudError(),
                            [proj.ProjectName]
                        );
                    },
                    myself.ide.cloudError()
                );
            }
        );
    }
};

ProjectDialogMorph.prototype.unshareProject = function () {
    var myself = this,
        proj = this.listField.selected,
        entry = this.listField.active;


    if (proj) {
        this.ide.confirm(
                localize(
                    'Are you sure you want to unpublish'
                ) + '\n"' + proj.ProjectName + '"?',
            'Unshare Project',
            function () {
                myself.ide.showMessage('unsharing\nproject...');
                SnapCloud.reconnect(
                    function () {
                        SnapCloud.callService(
                            'unpublishProject',
                            function () {
                                SnapCloud.disconnect();
                                proj.Public = 'false';
                                myself.shareButton.show();
                                myself.unshareButton.hide();
                                entry.label.isBold = false;
                                entry.label.drawNew();
                                entry.label.changed();
                                myself.buttons.fixLayout();
                                myself.drawNew();
                                myself.ide.showMessage('unshared.', 2);
                            },
                            myself.ide.cloudError(),
                            [proj.ProjectName]
                        );
                    },
                    myself.ide.cloudError()
                );
            }
        );
    }
};

ProjectDialogMorph.prototype.edit = function () {
    if (this.nameField) {
        this.nameField.edit();
    }
};

// ProjectDialogMorph layout

ProjectDialogMorph.prototype.fixLayout = function () {
    var th = fontHeight(this.titleFontSize) + this.titlePadding * 2,
        thin = this.padding / 2,
        oldFlag = Morph.prototype.trackChanges;

    Morph.prototype.trackChanges = false;

    if (this.buttons && (this.buttons.children.length > 0)) {
        this.buttons.fixLayout();
    }

    if (this.body) {
        this.body.setPosition(this.position().add(new Point(
            this.padding,
                th + this.padding
        )));
        this.body.setExtent(new Point(
                this.width() - this.padding * 2,
                this.height() - this.padding * 3 - th - this.buttons.height()
        ));
        this.srcBar.setPosition(this.body.position());
        if (this.nameField) {
            this.nameField.setWidth(
                    this.body.width() - this.srcBar.width() - this.padding * 6
            );
            this.nameField.setLeft(this.srcBar.right() + this.padding * 3);
            this.nameField.setTop(this.srcBar.top());
            this.nameField.drawNew();
        }

        this.listField.setLeft(this.srcBar.right() + this.padding);
        this.listField.setWidth(
                this.body.width()
                - this.srcBar.width()
                - this.preview.width()
                - this.padding
                - thin
        );
        this.listField.contents.children[0].adjustWidths();

        if (this.nameField) {
            this.listField.setTop(this.nameField.bottom() + this.padding);
            this.listField.setHeight(
                    this.body.height() - this.nameField.height() - this.padding
            );
        } else {
            this.listField.setTop(this.body.top());
            this.listField.setHeight(this.body.height());
        }

        this.preview.setRight(this.body.right());
        if (this.nameField) {
            this.preview.setTop(this.nameField.bottom() + this.padding);
        } else {
            this.preview.setTop(this.body.top());
        }

        this.notesField.setTop(this.preview.bottom() + thin);
        this.notesField.setLeft(this.preview.left());
        this.notesField.setHeight(
                this.body.bottom() - this.preview.bottom() - thin
        );
    }

    if (this.label) {
        this.label.setCenter(this.center());
        this.label.setTop(this.top() + (th - this.label.height()) / 2);
    }

    if (this.buttons && (this.buttons.children.length > 0)) {
        this.buttons.setCenter(this.center());
        this.buttons.setBottom(this.bottom() - this.padding);
    }

    Morph.prototype.trackChanges = oldFlag;
    this.changed();
};

// SpriteIconMorph ////////////////////////////////////////////////////

/*
 I am a selectable element in the Sprite corral, keeping a self-updating
 thumbnail of the sprite I'm respresenting, and a self-updating label
 of the sprite's name (in case it is changed elsewhere)
 */

// SpriteIconMorph inherits from ToggleButtonMorph (Widgets)

SpriteIconMorph.prototype = new ToggleButtonMorph();
SpriteIconMorph.prototype.constructor = SpriteIconMorph;
SpriteIconMorph.uber = ToggleButtonMorph.prototype;
SpriteIconMorph.className = 'SpriteIconMorph';
// SpriteIconMorph settings

SpriteIconMorph.prototype.thumbSize = new Point(40, 40);
SpriteIconMorph.prototype.labelShadowOffset = null;
SpriteIconMorph.prototype.labelShadowColor = null;
SpriteIconMorph.prototype.labelColor = new Color(255, 255, 255);
SpriteIconMorph.prototype.fontSize = 9;

// SpriteIconMorph instance creation:

function SpriteIconMorph(aSprite, aTemplate) {
    this.init(aSprite, aTemplate);
}

SpriteIconMorph.prototype.init = function (aSprite, aTemplate) {
    var colors, action, query, myself = this;

    if (!aTemplate) {
        colors = [
            IDE_Morph.prototype.groupColor,
            IDE_Morph.prototype.frameColor,
            IDE_Morph.prototype.frameColor
        ];

    }

    action = function () {
        // make my sprite the current one
        var ide = myself.parentThatIsA('IDE_Morph');

        if (ide) {
            ide.selectSprite(myself.object);
        }
    };

    query = function () {
        // answer true if my sprite is the current one
        var ide = myself.parentThatIsA('IDE_Morph');

        if (ide) {
            return ide.currentSprite === myself.object;
        }
        return false;
    };

    // additional properties:
    this.object = aSprite || new SpriteMorph(); // mandatory, actually
    this.version = this.object.version;
    this.thumbnail = null;
    this.rotationButton = null; // synchronous rotation of nested sprites

    // initialize inherited properties:
    SpriteIconMorph.uber.init.call(
        this,
        colors, // color overrides, <array>: [normal, highlight, pressed]
        null, // target - not needed here
        action, // a toggle function
        this.object.name, // label string
        query, // predicate/selector
        null, // environment
        null, // hint
        aTemplate // optional, for cached background images
    );

    // override defaults and build additional components
    this.isDraggable = true;
    this.acceptsDrops = false;
    this.createThumbnail();
    this.padding = 2;
    this.corner = 8;
    this.fixLayout();
    this.fps = 1;
};

SpriteIconMorph.prototype.createThumbnail = function () {
    if (this.thumbnail) {
        this.thumbnail.destroy();
    }

    this.thumbnail = new Morph();
    this.thumbnail.acceptsDrops = false;
    this.thumbnail.setExtent(this.thumbSize);
    if (this.object instanceof SpriteMorph) { // support nested sprites
        this.thumbnail.image = this.object.fullThumbnail(this.thumbSize);
        this.createRotationButton();
    } else {
        this.thumbnail.image = this.object.thumbnail(this.thumbSize);
    }
    this.add(this.thumbnail);
};

SpriteIconMorph.prototype.createLabel = function () {
    var txt;

    if (this.label) {
        this.label.destroy();
    }
    txt = new StringMorph(
        this.object.name,
        this.fontSize,
        this.fontStyle,
        true,
        false,
        false,
        this.labelShadowOffset,
        this.labelShadowColor,
        this.labelColor
    );

    this.label = new FrameMorph();
    this.label.acceptsDrops = false;
    this.label.alpha = 0;
    this.label.setExtent(txt.extent());
    txt.setPosition(this.label.position());
    this.label.add(txt);
    this.add(this.label);
};

SpriteIconMorph.prototype.createRotationButton = function () {
    var button, myself = this;

    if (this.rotationButton) {
        this.rotationButton.destroy();
        this.roationButton = null;
    }
    if (!this.object.anchor) {
        return;
    }

    button = new ToggleButtonMorph(
        null, // colors,
        null, // target
        function () {
            myself.object.rotatesWithAnchor = !myself.object.rotatesWithAnchor;
        },
        [
            '\u2192',
            '\u21BB'
        ],
        function () {  // query
            return myself.object.rotatesWithAnchor;
        }
    );

    button.corner = 8;
    button.labelMinExtent = new Point(11, 11);
    button.padding = 0;
    button.pressColor = button.color;
    button.drawNew();
    // button.hint = 'rotate synchronously\nwith anchor';
    button.fixLayout();
    button.refresh();
    button.changed();
    this.rotationButton = button;
    this.add(this.rotationButton);
};

// SpriteIconMorph stepping

SpriteIconMorph.prototype.step = function () {
    if (this.version !== this.object.version) {
        this.createThumbnail();
        this.createLabel();
        this.fixLayout();
        this.version = this.object.version;
        this.refresh();
    }
};

// SpriteIconMorph layout

SpriteIconMorph.prototype.fixLayout = function () {
    if (!this.thumbnail || !this.label) {
        return null;
    }

    this.setWidth(
            this.thumbnail.width()
            + this.outline * 2
            + this.edge * 2
            + this.padding * 2
    );

    this.setHeight(
            this.thumbnail.height()
            + this.outline * 2
            + this.edge * 2
            + this.padding * 3
            + this.label.height()
    );

    this.thumbnail.setCenter(this.center());
    this.thumbnail.setTop(
            this.top() + this.outline + this.edge + this.padding
    );

    if (this.rotationButton) {
        this.rotationButton.setTop(this.top());
        this.rotationButton.setRight(this.right());
    }

    this.label.setWidth(
        Math.min(
            this.label.children[0].width(), // the actual text
            this.thumbnail.width()
        )
    );
    this.label.setCenter(this.center());
    this.label.setTop(
            this.thumbnail.bottom() + this.padding
    );
};

// SpriteIconMorph menu

SpriteIconMorph.prototype.userMenu = function () {
    var menu = new MenuMorph(this),
        myself = this;
    if (this.object instanceof StageMorph) {
        menu.addItem(
            'pic...',
            function () {
                window.open(myself.object.fullImageClassic().toDataURL());
            },
            'open a new window\nwith a picture of the stage'
        );
        return menu;
    }
    if (!(this.object instanceof SpriteMorph)) {
        return null;
    }
    menu.addItem("show", 'showSpriteOnStage');
    menu.addLine();
    menu.addItem("duplicate", 'duplicateSprite');
    menu.addItem("delete", 'removeSprite');
    menu.addLine();
    if (this.object.anchor) {
        menu.addItem(
                localize('detach from') + ' ' + this.object.anchor.name,
            function () {
                myself.object.detachFromAnchor();
            }
        );
    }
    if (this.object.parts.length) {
        menu.addItem(
            'detach all parts',
            function () {
                myself.object.detachAllParts();
            }
        );
    }
    menu.addItem("export...", 'exportSprite');
    return menu;
};

SpriteIconMorph.prototype.duplicateSprite = function () {
    var ide = this.parentThatIsA('IDE_Morph');
    if (ide) {
        ide.duplicateSprite(this.object);
    }
};

SpriteIconMorph.prototype.removeSprite = function () {
    var ide = this.parentThatIsA('IDE_Morph');
    if (ide) {
        ide.removeSprite(this.object);
    }
};

SpriteIconMorph.prototype.exportSprite = function () {
    this.object.exportSprite();
};

SpriteIconMorph.prototype.showSpriteOnStage = function () {
    this.object.showOnStage();
};

// SpriteIconMorph drawing

SpriteIconMorph.prototype.createBackgrounds = function () {
//    only draw the edges if I am selected
    var context,
        ext = this.extent();

    if (this.template) { // take the backgrounds images from the template
        this.image = this.template.image;
        this.normalImage = this.template.normalImage;
        this.highlightImage = this.template.highlightImage;
        this.pressImage = this.template.pressImage;
        return null;
    }

    this.normalImage = newCanvas(ext);
    context = this.normalImage.getContext('2d');
    this.drawBackground(context, this.color);

    this.highlightImage = newCanvas(ext);
    context = this.highlightImage.getContext('2d');
    this.drawBackground(context, this.highlightColor);

    this.pressImage = newCanvas(ext);
    context = this.pressImage.getContext('2d');
    this.drawOutline(context);
    this.drawBackground(context, this.pressColor);
    this.drawEdges(
        context,
        this.pressColor,
        this.pressColor.lighter(this.contrast),
        this.pressColor.darker(this.contrast)
    );

    this.image = this.normalImage;
};

// SpriteIconMorph drag & drop

SpriteIconMorph.prototype.prepareToBeGrabbed = function () {
    var ide = this.parentThatIsA('IDE_Morph'),
        idx;
    this.mouseClickLeft(); // select me
    if (ide) {
        idx = ide.sprites.asArray().indexOf(this.object);
        ide.sprites.remove(idx + 1);
        ide.createCorral();
        ide.fixLayout();
    }
};

SpriteIconMorph.prototype.wantsDropOf = function (morph) {
    // allow scripts & media to be copied from one sprite to another
    // by drag & drop
    return morph instanceof BlockMorph
        || (morph instanceof CostumeIconMorph)
        || (morph instanceof SoundIconMorph);
};

SpriteIconMorph.prototype.reactToDropOf = function (morph, hand) {
    if (morph instanceof BlockMorph) {
        this.copyStack(morph);
    } else if (morph instanceof CostumeIconMorph) {
        this.copyCostume(morph.object);
    } else if (morph instanceof SoundIconMorph) {
        this.copySound(morph.object);
    }
    this.world().add(morph);
    morph.slideBackTo(hand.grabOrigin);
};

SpriteIconMorph.prototype.copyStack = function (block) {
    var dup = block.fullCopy(),
        y = Math.max(this.object.scripts.children.map(function (stack) {
            return stack.fullBounds().bottom();
        }).concat([this.object.scripts.top()]));

    dup.setPosition(new Point(this.object.scripts.left() + 20, y + 20));
    this.object.scripts.add(dup);
    dup.allComments().forEach(function (comment) {
        comment.align(dup);
    });
    this.object.scripts.adjustBounds();

    // delete all custom blocks pointing to local definitions
    // under construction...
    dup.allChildren().forEach(function (morph) {
        if (morph.definition && !morph.definition.isGlobal) {
            morph.deleteBlock();
        }
    });
};

SpriteIconMorph.prototype.copyCostume = function (costume) {
    var dup = costume.copy();
    dup.name = this.object.newCostumeName(dup.name);
    this.object.addCostume(dup);
    this.object.wearCostume(dup);
};

SpriteIconMorph.prototype.copySound = function (sound) {
    var dup = sound.copy();
    this.object.addSound(dup.audio, dup.name);
};

// CostumeIconMorph ////////////////////////////////////////////////////

/*
 I am a selectable element in the SpriteEditor's "Costumes" tab, keeping
 a self-updating thumbnail of the costume I'm respresenting, and a
 self-updating label of the costume's name (in case it is changed
 elsewhere)
 */

// CostumeIconMorph inherits from ToggleButtonMorph (Widgets)
// ... and copies methods from SpriteIconMorph

CostumeIconMorph.prototype = new ToggleButtonMorph();
CostumeIconMorph.prototype.constructor = CostumeIconMorph;
CostumeIconMorph.uber = ToggleButtonMorph.prototype;
CostumeIconMorph.className = 'CostumeIconMorph';
// CostumeIconMorph settings

CostumeIconMorph.prototype.thumbSize = new Point(80, 60);
CostumeIconMorph.prototype.labelShadowOffset = null;
CostumeIconMorph.prototype.labelShadowColor = null;
CostumeIconMorph.prototype.labelColor = new Color(255, 255, 255);
CostumeIconMorph.prototype.fontSize = 9;

// CostumeIconMorph instance creation:

function CostumeIconMorph(aCostume, aTemplate) {
    this.init(aCostume, aTemplate);
}

CostumeIconMorph.prototype.init = function (aCostume, aTemplate) {
    var colors, action, query, myself = this;

    if (!aTemplate) {
        colors = [
            IDE_Morph.prototype.groupColor,
            IDE_Morph.prototype.frameColor,
            IDE_Morph.prototype.frameColor
        ];

    }

    action = function () {
        // make my costume the current one
        var ide = myself.parentThatIsA('IDE_Morph'),
            wardrobe = myself.parentThatIsA('WardrobeMorph');

        if (ide) {
            ide.currentSprite.wearCostume(myself.object);
        }
        if (wardrobe) {
            wardrobe.updateSelection();
        }
    };

    query = function () {
        // answer true if my costume is the current one
        var ide = myself.parentThatIsA('IDE_Morph');

        if (ide) {
            return ide.currentSprite.costume === myself.object;
        }
        return false;
    };

    // additional properties:
    this.object = aCostume || new Costume(); // mandatory, actually
    this.version = this.object.version;
    this.thumbnail = null;

    // initialize inherited properties:
    CostumeIconMorph.uber.init.call(
        this,
        colors, // color overrides, <array>: [normal, highlight, pressed]
        null, // target - not needed here
        action, // a toggle function
        this.object.name, // label string
        query, // predicate/selector
        null, // environment
        null, // hint
        aTemplate // optional, for cached background images
    );

    // override defaults and build additional components
    this.isDraggable = true;
    this.createThumbnail();
    this.padding = 2;
    this.corner = 8;
    this.fixLayout();
    this.fps = 1;
};

CostumeIconMorph.prototype.createThumbnail
    = SpriteIconMorph.prototype.createThumbnail;

CostumeIconMorph.prototype.createLabel
    = SpriteIconMorph.prototype.createLabel;

// CostumeIconMorph stepping

CostumeIconMorph.prototype.step
    = SpriteIconMorph.prototype.step;

// CostumeIconMorph layout

CostumeIconMorph.prototype.fixLayout
    = SpriteIconMorph.prototype.fixLayout;

// CostumeIconMorph menu

CostumeIconMorph.prototype.userMenu = function () {
    var menu = new MenuMorph(this);
    if (!(this.object instanceof Costume)) {
        return null;
    }
    if (!(this.parentThatIsA('WardrobeMorph') instanceof ShareBoxAssetsMorph)) {
        menu.addItem("edit", "editCostume");
        if (this.world().currentKey === 16) { // shift clicked
            menu.addItem(
                'edit rotation point only...',
                'editRotationPointOnly',
                null,
                new Color(100, 0, 0)
            );
        }
        menu.addItem("rename", "renameCostume");
        menu.addLine();
        menu.addItem("duplicate", "duplicateCostume");
    }
    menu.addItem("delete", "removeCostume");
    if (!(this.parentThatIsA('WardrobeMorph') instanceof ShareBoxAssetsMorph)) {
        menu.addLine();
        menu.addItem("export", "exportCostume");
    }
    return menu;
};

CostumeIconMorph.prototype.editCostume = function () {
    if (this.object instanceof SVG_Costume) {
        this.object.editRotationPointOnly(this.world());
    } else {
        this.object.edit(
            this.world(),
            this.parentThatIsA('IDE_Morph')
        );
    }
};

CostumeIconMorph.prototype.editRotationPointOnly = function () {
    var ide = this.parentThatIsA('IDE_Morph');
    this.object.editRotationPointOnly(this.world());
    ide.hasChangedMedia = true;
};

CostumeIconMorph.prototype.renameCostume = function () {
    var costume = this.object,
        wardrobe = this.parentThatIsA('WardrobeMorph'),
        ide = this.parentThatIsA('IDE_Morph');
    new DialogBoxMorph(
        null,
        function (answer) {
            if (answer && (answer !== costume.name)) {
                costume.name = wardrobe.sprite.newCostumeName(
                    answer,
                    costume
                );
                costume.version = Date.now();
                ide.hasChangedMedia = true;
            }
        }
    ).prompt(
        'rename costume',
        costume.name,
        this.world()
    );
};

CostumeIconMorph.prototype.duplicateCostume = function () {
    var wardrobe = this.parentThatIsA('WardrobeMorph'),
        ide = this.parentThatIsA('IDE_Morph'),
        newcos = this.object.copy();
    newcos.name = wardrobe.sprite.newCostumeName(newcos.name);
    wardrobe.sprite.addCostume(newcos);
    wardrobe.updateList();
    if (ide) {
        ide.currentSprite.wearCostume(newcos);
    }
};

CostumeIconMorph.prototype.removeCostume = function () {
    var wardrobe = this.parentThatIsA('WardrobeMorph'),
        idx = this.parent.children.indexOf(this),
        ide = this.parentThatIsA('IDE_Morph');
    wardrobe.removeCostumeAt(idx - 2);
    if (ide.currentSprite.costume === this.object) {
        ide.currentSprite.wearCostume(null);
    }

    if (wardrobe instanceof ShareBoxAssetsMorph) {
        var ide = this.parentThatIsA('IDE_Morph');
        var dataList = ide.sharer.buildDataList();
        //ide.sharer.socket.emit('REMOVE_ITEM', dataList);
        ide.sharer.socket.emit('REMOVE_ITEM',
            { room: ide.sharer.room,
                data: {name: this.object.name}
            })
        console.log(dataList);
        ide.hasChangedMedia = true;
        ide.createShareBox();
        ide.drawNew();
        ide.fixLayout();
    }
};

CostumeIconMorph.prototype.exportCostume = function () {
    if (this.object instanceof SVG_Costume) {
        window.open(this.object.contents.src);
    } else { // rastered Costume
        window.open(this.object.contents.toDataURL());
    }
};

// CostumeIconMorph drawing

CostumeIconMorph.prototype.createBackgrounds
    = SpriteIconMorph.prototype.createBackgrounds;

// CostumeIconMorph drag & drop

CostumeIconMorph.prototype.prepareToBeGrabbed = function () {
    this.mouseClickLeft(); // select me
    this.removeCostume();
};

// TurtleIconMorph ////////////////////////////////////////////////////

/*
 I am a selectable element in the SpriteEditor's "Costumes" tab, keeping
 a thumbnail of the sprite's or stage's default "Turtle" costume.
 */

// TurtleIconMorph inherits from ToggleButtonMorph (Widgets)
// ... and copies methods from SpriteIconMorph

TurtleIconMorph.prototype = new ToggleButtonMorph();
TurtleIconMorph.prototype.constructor = TurtleIconMorph;
TurtleIconMorph.uber = ToggleButtonMorph.prototype;
TurtleIconMorph.className = 'TurtleIconMorph';
// TurtleIconMorph settings

TurtleIconMorph.prototype.thumbSize = new Point(80, 60);
TurtleIconMorph.prototype.labelShadowOffset = null;
TurtleIconMorph.prototype.labelShadowColor = null;
TurtleIconMorph.prototype.labelColor = new Color(255, 255, 255);
TurtleIconMorph.prototype.fontSize = 9;

// TurtleIconMorph instance creation:

function TurtleIconMorph(aSpriteOrStage, aTemplate) {
    this.init(aSpriteOrStage, aTemplate);
}

TurtleIconMorph.prototype.init = function (aSpriteOrStage, aTemplate) {
    var colors, action, query, myself = this;

    if (!aTemplate) {
        colors = [
            IDE_Morph.prototype.groupColor,
            IDE_Morph.prototype.frameColor,
            IDE_Morph.prototype.frameColor
        ];

    }

    action = function () {
        // make my costume the current one
        var ide = myself.parentThatIsA('IDE_Morph'),
            wardrobe = myself.parentThatIsA('WardrobeMorph');

        if (ide) {
            ide.currentSprite.wearCostume(null);
        }
        if (wardrobe) {
            wardrobe.updateSelection();
        }
    };

    query = function () {
        // answer true if my costume is the current one
        var ide = myself.parentThatIsA('IDE_Morph');

        if (ide) {
            return ide.currentSprite.costume === null;
        }
        return false;
    };

    // additional properties:
    this.object = aSpriteOrStage; // mandatory, actually
    this.version = this.object.version;
    this.thumbnail = null;

    // initialize inherited properties:
    TurtleIconMorph.uber.init.call(
        this,
        colors, // color overrides, <array>: [normal, highlight, pressed]
        null, // target - not needed here
        action, // a toggle function
        'default', // label string
        query, // predicate/selector
        null, // environment
        null, // hint
        aTemplate // optional, for cached background images
    );

    // override defaults and build additional components
    this.isDraggable = false;
    this.createThumbnail();
    this.padding = 2;
    this.corner = 8;
    this.fixLayout();
};

TurtleIconMorph.prototype.createThumbnail = function () {
    var isFlat = MorphicPreferences.isFlat;

    if (this.thumbnail) {
        this.thumbnail.destroy();
    }
    if (this.object instanceof SpriteMorph) {
        this.thumbnail = new SymbolMorph(
            'turtle',
            this.thumbSize.y,
            this.labelColor,
            isFlat ? null : new Point(-1, -1),
            new Color(0, 0, 0)
        );
    } else {
        this.thumbnail = new SymbolMorph(
            'stage',
            this.thumbSize.y,
            this.labelColor,
            isFlat ? null : new Point(-1, -1),
            new Color(0, 0, 0)
        );
    }
    this.add(this.thumbnail);
};

TurtleIconMorph.prototype.createLabel = function () {
    var txt;

    if (this.label) {
        this.label.destroy();
    }
    txt = new StringMorph(
        localize(
                this.object instanceof SpriteMorph ? 'Turtle' : 'Empty'
        ),
        this.fontSize,
        this.fontStyle,
        true,
        false,
        false,
        this.labelShadowOffset,
        this.labelShadowColor,
        this.labelColor
    );

    this.label = new FrameMorph();
    this.label.acceptsDrops = false;
    this.label.alpha = 0;
    this.label.setExtent(txt.extent());
    txt.setPosition(this.label.position());
    this.label.add(txt);
    this.add(this.label);
};

// TurtleIconMorph layout

TurtleIconMorph.prototype.fixLayout
    = SpriteIconMorph.prototype.fixLayout;

// TurtleIconMorph drawing

TurtleIconMorph.prototype.createBackgrounds
    = SpriteIconMorph.prototype.createBackgrounds;

// TurtleIconMorph user menu

TurtleIconMorph.prototype.userMenu = function () {
    var myself = this,
        menu = new MenuMorph(this, 'pen'),
        on = '\u25CF',
        off = '\u25CB';
    if (this.object instanceof StageMorph) {
        return null;
    }
    menu.addItem(
            (this.object.penPoint === 'tip' ? on : off) + ' ' + localize('tip'),
        function () {
            myself.object.penPoint = 'tip';
            myself.object.changed();
            myself.object.drawNew();
            myself.object.changed();
        }
    );
    menu.addItem(
            (this.object.penPoint === 'middle' ? on : off) + ' ' + localize(
            'middle'
        ),
        function () {
            myself.object.penPoint = 'middle';
            myself.object.changed();
            myself.object.drawNew();
            myself.object.changed();
        }
    );
    return menu;
};

// WardrobeMorph ///////////////////////////////////////////////////////

// I am a watcher on a sprite's costume list

// WardrobeMorph inherits from ScrollFrameMorph

WardrobeMorph.prototype = new ScrollFrameMorph();
WardrobeMorph.prototype.constructor = WardrobeMorph;
WardrobeMorph.uber = ScrollFrameMorph.prototype;
WardrobeMorph.className = 'WardrobeMorph';
// WardrobeMorph settings

// ... to follow ...

// WardrobeMorph instance creation:

function WardrobeMorph(aSprite, sliderColor) {
    this.init(aSprite, sliderColor);
}

WardrobeMorph.prototype.init = function (aSprite, sliderColor) {
    // additional properties
    this.sprite = aSprite || new SpriteMorph();
    this.costumesVersion = null;
    this.spriteVersion = null;

    // initialize inherited properties
    WardrobeMorph.uber.init.call(this, null, null, sliderColor);

    // configure inherited properties
    this.fps = 30;
    this.updateList();
};

// Wardrobe updating

WardrobeMorph.prototype.updateList = function () {
    var myself = this,
        x = this.left() + 5,
        y = this.top() + 5,
        padding = 4,
        oldFlag = Morph.prototype.trackChanges,
        oldPos = this.contents.position(),
        icon,
        template,
        txt,
        paintbutton;

    this.changed();
    oldFlag = Morph.prototype.trackChanges;
    Morph.prototype.trackChanges = false;

    this.contents.destroy();
    this.contents = new FrameMorph(this);
    this.contents.acceptsDrops = false;
    this.contents.reactToDropOf = function (icon) {
        myself.reactToDropOf(icon);
    };
    this.addBack(this.contents);

    icon = new TurtleIconMorph(this.sprite);
    icon.setPosition(new Point(x, y));
    myself.addContents(icon);
    y = icon.bottom() + padding;

    paintbutton = new PushButtonMorph(
        this,
        "paintNew",
        new SymbolMorph("brush", 15)
    );
    paintbutton.padding = 0;
    paintbutton.corner = 12;
    paintbutton.color = IDE_Morph.prototype.groupColor;
    paintbutton.highlightColor = IDE_Morph.prototype.frameColor.darker(50);
    paintbutton.pressColor = paintbutton.highlightColor;
    paintbutton.labelMinExtent = new Point(36, 18);
    paintbutton.labelShadowOffset = new Point(-1, -1);
    paintbutton.labelShadowColor = paintbutton.highlightColor;
    paintbutton.labelColor = TurtleIconMorph.prototype.labelColor;
    paintbutton.contrast = this.buttonContrast;
    paintbutton.drawNew();
    paintbutton.hint = "Paint a new costume";
    paintbutton.setPosition(new Point(x, y));
    paintbutton.fixLayout();
    paintbutton.setCenter(icon.center());
    paintbutton.setLeft(icon.right() + padding * 4);


    this.addContents(paintbutton);

    txt = new TextMorph(localize(
        "costumes tab help" // look up long string in translator
    ));
    txt.fontSize = 9;
    txt.setColor(SpriteMorph.prototype.paletteTextColor);

    txt.setPosition(new Point(x, y));
    this.addContents(txt);
    y = txt.bottom() + padding;


    this.sprite.costumes.asArray().forEach(function (costume) {
        template = icon = new CostumeIconMorph(costume, template);
        icon.setPosition(new Point(x, y));
        myself.addContents(icon);
        y = icon.bottom() + padding;
    });
    this.costumesVersion = this.sprite.costumes.lastChanged;

    this.contents.setPosition(oldPos);
    this.adjustScrollBars();
    Morph.prototype.trackChanges = oldFlag;
    this.changed();

    this.updateSelection();
};

WardrobeMorph.prototype.updateSelection = function () {
    this.contents.children.forEach(function (morph) {
        if (morph.refresh) {
            morph.refresh();
        }
    });
    this.spriteVersion = this.sprite.version;
};

// Wardrobe stepping

WardrobeMorph.prototype.step = function () {
    if (this.costumesVersion !== this.sprite.costumes.lastChanged) {
        this.updateList();
    }
    if (this.spriteVersion !== this.sprite.version) {
        this.updateSelection();
    }
};

// Wardrobe ops

WardrobeMorph.prototype.removeCostumeAt = function (idx) {
    this.sprite.costumes.remove(idx);
    this.updateList();
};

WardrobeMorph.prototype.paintNew = function () {
    var cos = new Costume(
            newCanvas(),
            this.sprite.newCostumeName('Untitled')
        ),
        ide = this.parentThatIsA('IDE_Morph'),
        myself = this;
    cos.edit(this.world(), ide, true, null, function () {
        myself.sprite.addCostume(cos);
        myself.updateList();
        if (ide) {
            ide.currentSprite.wearCostume(cos);
        }
    });
};

// Wardrobe drag & drop

WardrobeMorph.prototype.wantsDropOf = function (morph) {
    return morph instanceof CostumeIconMorph;
};

WardrobeMorph.prototype.reactToDropOf = function (icon) {
    var idx = 0,
        costume = icon.object,
        top = icon.top();

    icon.destroy();
    this.contents.children.forEach(function (item) {
        if (item instanceof CostumeIconMorph && item.top() < top - 4) {
            idx += 1;
        }
    });
    this.sprite.costumes.add(costume, idx + 1);
    this.updateList();
    icon.mouseClickLeft(); // select
};

// SoundIconMorph ///////////////////////////////////////////////////////

/*
 I am an element in the SpriteEditor's "Sounds" tab.
 */

// SoundIconMorph inherits from ToggleButtonMorph (Widgets)
// ... and copies methods from SpriteIconMorph

SoundIconMorph.prototype = new ToggleButtonMorph();
SoundIconMorph.prototype.constructor = SoundIconMorph;
SoundIconMorph.uber = ToggleButtonMorph.prototype;
SoundIconMorph.className = 'SoundIconMorph';
// SoundIconMorph settings

SoundIconMorph.prototype.thumbSize = new Point(80, 60);
SoundIconMorph.prototype.labelShadowOffset = null;
SoundIconMorph.prototype.labelShadowColor = null;
SoundIconMorph.prototype.labelColor = new Color(255, 255, 255);
SoundIconMorph.prototype.fontSize = 9;

// SoundIconMorph instance creation:

function SoundIconMorph(aSound, aTemplate) {
    this.init(aSound, aTemplate);
}

SoundIconMorph.prototype.init = function (aSound, aTemplate) {
    var colors, action, query;

    if (!aTemplate) {
        colors = [
            IDE_Morph.prototype.groupColor,
            IDE_Morph.prototype.frameColor,
            IDE_Morph.prototype.frameColor
        ];

    }

    action = function () {
        nop(); // When I am selected (which is never the case for sounds)
    };

    query = function () {
        return false;
    };

    // additional properties:
    this.object = aSound; // mandatory, actually
    this.version = this.object.version;
    this.thumbnail = null;

    // initialize inherited properties:
    SoundIconMorph.uber.init.call(
        this,
        colors, // color overrides, <array>: [normal, highlight, pressed]
        null, // target - not needed here
        action, // a toggle function
        this.object.name, // label string
        query, // predicate/selector
        null, // environment
        null, // hint
        aTemplate // optional, for cached background images
    );

    // override defaults and build additional components
    this.isDraggable = true;
    this.createThumbnail();
    this.padding = 2;
    this.corner = 8;
    this.fixLayout();
    this.fps = 1;
};

SoundIconMorph.prototype.createThumbnail = function () {
    var label;
    if (this.thumbnail) {
        this.thumbnail.destroy();
    }
    this.thumbnail = new Morph();
    this.thumbnail.setExtent(this.thumbSize);
    this.add(this.thumbnail);
    label = new StringMorph(
        this.createInfo(),
        '16',
        '',
        true,
        false,
        false,
        this.labelShadowOffset,
        this.labelShadowColor,
        new Color(200, 200, 200)
    );
    this.thumbnail.add(label);
    label.setCenter(new Point(40, 15));

    this.button = new PushButtonMorph(
        this,
        'toggleAudioPlaying',
        (this.object.previewAudio ? 'Stop' : 'Play')
    );
    this.button.drawNew();
    this.button.hint = 'Play sound';
    this.button.fixLayout();
    this.thumbnail.add(this.button);
    this.button.setCenter(new Point(40, 40));
};

SoundIconMorph.prototype.createInfo = function () {
    var dur = Math.round(this.object.audio.duration || 0),
        mod = dur % 60;
    return Math.floor(dur / 60).toString()
        + ":"
        + (mod < 10 ? "0" : "")
        + mod.toString();
};

SoundIconMorph.prototype.toggleAudioPlaying = function () {
    var myself = this;
    if (!this.object.previewAudio) {
        //Audio is not playing
        this.button.labelString = 'Stop';
        this.button.hint = 'Stop sound';
        this.object.previewAudio = this.object.play();
        this.object.previewAudio.addEventListener('ended', function () {
            myself.audioHasEnded();
        }, false);
    } else {
        //Audio is currently playing
        this.button.labelString = 'Play';
        this.button.hint = 'Play sound';
        this.object.previewAudio.pause();
        this.object.previewAudio.terminated = true;
        this.object.previewAudio = null;
    }
    this.button.createLabel();
};

SoundIconMorph.prototype.audioHasEnded = function () {
    this.button.trigger();
    this.button.mouseLeave();
};

SoundIconMorph.prototype.createLabel
    = SpriteIconMorph.prototype.createLabel;

// SoundIconMorph stepping

/*
 SoundIconMorph.prototype.step
 = SpriteIconMorph.prototype.step;
 */

// SoundIconMorph layout

SoundIconMorph.prototype.fixLayout
    = SpriteIconMorph.prototype.fixLayout;

// SoundIconMorph menu

SoundIconMorph.prototype.userMenu = function () {
    var menu = new MenuMorph(this);
    if (!(this.object instanceof Sound)) {
        return null;
    }
    if (!(this.parent.parent instanceof ShareBoxAssetsMorph)) {
        menu.addItem('rename', 'renameSound');
    }
    menu.addItem('delete', 'removeSound');
    return menu;
};


SoundIconMorph.prototype.renameSound = function () {
    var sound = this.object,
        ide = this.parentThatIsA('IDE_Morph'),
        myself = this;
    (new DialogBoxMorph(
        null,
        function (answer) {
            if (answer && (answer !== sound.name)) {
                sound.name = answer;
                sound.version = Date.now();
                myself.createLabel(); // can be omitted once I'm stepping
                myself.fixLayout(); // can be omitted once I'm stepping
                ide.hasChangedMedia = true;
            }
        }
    )).prompt(
        'rename sound',
        sound.name,
        this.world()
    );
};

SoundIconMorph.prototype.removeSound = function () {
    if (this.parentThatIsA('JukeboxMorph')) {
        var jukebox = this.parentThatIsA('JukeboxMorph'),
            idx = this.parent.children.indexOf(this);
        jukebox.removeSound(idx);
    }
    if ((this.parent.parent instanceof ShareBoxAssetsMorph)) {
        var ide = this.parentThatIsA('IDE_Morph');
        var idx = this.parent.children.indexOf(this);
        ide.shareBoxPlaceholderSprite.sounds.contents.splice(idx, 1);
        this.parent.children.splice(idx, 1);
        ide.sharer.socket.emit('REMOVE_ITEM',
            { room: ide.sharer.room,
              data: {name: this.object.name}
            });
        ide.hasChangedMedia = true;
        ide.createShareBox();
        ide.drawNew();
        ide.fixLayout();
    }
};

SoundIconMorph.prototype.createBackgrounds
    = SpriteIconMorph.prototype.createBackgrounds;

SoundIconMorph.prototype.createLabel
    = SpriteIconMorph.prototype.createLabel;

// SoundIconMorph drag & drop

SoundIconMorph.prototype.prepareToBeGrabbed = function () {
    this.removeSound();
};

// JukeboxMorph /////////////////////////////////////////////////////

/*
 I am JukeboxMorph, like WardrobeMorph, but for sounds
 */

// JukeboxMorph instance creation

JukeboxMorph.prototype = new ScrollFrameMorph();
JukeboxMorph.prototype.constructor = JukeboxMorph;
JukeboxMorph.uber = ScrollFrameMorph.prototype;
JukeboxMorph.className = 'JukeboxMorph';

function JukeboxMorph(aSprite, sliderColor) {
    this.init(aSprite, sliderColor);
}

JukeboxMorph.prototype.init = function (aSprite, sliderColor) {
    // additional properties
    this.sprite = aSprite || new SpriteMorph();
    this.costumesVersion = null;
    this.spriteVersion = null;

    // initialize inherited properties
    JukeboxMorph.uber.init.call(this, null, null, sliderColor);

    // configure inherited properties
    this.acceptsDrops = false;
    this.fps = 2;
    this.updateList();
};

// Jukebox updating

JukeboxMorph.prototype.updateList = function () {
    var myself = this,
        x = this.left() + 5,
        y = this.top() + 5,
        padding = 4,
        oldFlag = Morph.prototype.trackChanges,
        icon,
        template,
        txt;

    this.changed();
    oldFlag = Morph.prototype.trackChanges;
    Morph.prototype.trackChanges = false;

    this.contents.destroy();
    this.contents = new FrameMorph(this);
    this.contents.acceptsDrops = false;
    this.contents.reactToDropOf = function (icon) {
        myself.reactToDropOf(icon);
    };
    this.addBack(this.contents);

    txt = new TextMorph(localize(
        'import a sound from your computer\nby dragging it into here'
    ));
    txt.fontSize = 9;
    txt.setColor(SpriteMorph.prototype.paletteTextColor);
    txt.setPosition(new Point(x, y));
    this.addContents(txt);
    y = txt.bottom() + padding;

    this.sprite.sounds.asArray().forEach(function (sound) {
        template = icon = new SoundIconMorph(sound, template);
        icon.setPosition(new Point(x, y));
        myself.addContents(icon);
        y = icon.bottom() + padding;
    });

    Morph.prototype.trackChanges = oldFlag;
    this.changed();

    this.updateSelection();
};

JukeboxMorph.prototype.updateSelection = function () {
    this.contents.children.forEach(function (morph) {
        if (morph.refresh) {
            morph.refresh();
        }
    });
    this.spriteVersion = this.sprite.version;
};

// Jukebox stepping

/*
 JukeboxMorph.prototype.step = function () {
 if (this.spriteVersion !== this.sprite.version) {
 this.updateSelection();
 }
 };
 */

// Jukebox ops

JukeboxMorph.prototype.removeSound = function (idx) {
    this.sprite.sounds.remove(idx);
    this.updateList();
};

// Jukebox drag & drop

JukeboxMorph.prototype.wantsDropOf = function (morph) {
    return morph instanceof SoundIconMorph;
};

JukeboxMorph.prototype.reactToDropOf = function (icon) {
    var idx = 0,
        costume = icon.object,
        top = icon.top();

    icon.destroy();
    this.contents.children.forEach(function (item) {
        if (item.top() < top - 4) {
            idx += 1;
        }
    });
    this.sprite.sounds.add(costume, idx);
    this.updateList();
};

// ShareBoxAssetsMorph ///////////////////////////////////////////////////////

// I am a watcher on the Sharebox for shared costumes

// ShareBoxAssetsMorph inherits from WardrobeMorph

// Huan Song: Some interesting inheritance going here. I still need to figure out what's going on, but this works atm.
ShareBoxAssetsMorph.prototype = Object.create(WardrobeMorph.prototype);
ShareBoxAssetsMorph.className = 'ShareBoxAssetsMorph';

function ShareBoxAssetsMorph(aSprite, sliderColor) {
    this.init(aSprite, sliderColor);
};

ShareBoxAssetsMorph.prototype.wantsDropOf = function (morph) {
    return morph instanceof SoundIconMorph || morph instanceof CostumeIconMorph;
};

ShareBoxAssetsMorph.prototype.changed = function () {
    if (this.trackChanges) {
        var w = this.root();
        if (w.instanceOf('WorldMorph')) {
            w.broken.push(this.visibleBounds().spread());
        }
    }
    if (this.parent) {
        this.parent.childChanged(this);
    }
};

ShareBoxAssetsMorph.init = function (aSprite, sliderColor) {
    // additional properties
    this.sprite = aSprite || new SpriteMorph();
    this.costumesVersion = null;
    this.spriteVersion = null;

    // initialize inherited properties
    ShareBoxAssetsMorph.uber.init.call(this, null, null, sliderColor);

    // configure inherited properties
    this.fps = 30;
    this.updateList();
};

ShareBoxAssetsMorph.prototype.updateList = function () {
    var myself = this,
        x = this.left() + 5,
        y = this.top() + 5,
        padding = 4,
        oldFlag = Morph.prototype.trackChanges,
        oldPos = this.contents.position(),
        icon,
        template,
        txt,
        paintbutton;

    this.changed();
    oldFlag = Morph.prototype.trackChanges;
    Morph.prototype.trackChanges = false;

    this.contents.destroy();
    this.contents = new FrameMorph(this);
    this.contents.acceptsDrops = false;
    this.contents.reactToDropOf = function (icon) {
        myself.reactToDropOf(icon);
    };
    this.addBack(this.contents);

    var numCostumes = 0;
    this.sprite.costumes.asArray().forEach(function (costume) {
        template = icon = new CostumeIconMorph(costume, template);
        icon.setPosition(new Point(x, y));
        myself.addContents(icon);
        numCostumes++;
        if (numCostumes != 0 && numCostumes%5 == 0) {
            y = icon.bottom() + padding;
            x = myself.left() + 5;
        } else {
            x = icon.right() + padding;
        }
    });
    this.costumesVersion = this.sprite.costumes.lastChanged;


    this.sprite.sounds.asArray().forEach(function (sound) {
        template = icon = new SoundIconMorph(sound, template);
        icon.setPosition(new Point(x, y));
        myself.addContents(icon);
        numCostumes++;
        if (numCostumes != 0 && numCostumes%5 == 0) {
            y = icon.bottom() + padding;
            x = myself.left() + 5;
        } else {
            x = icon.right() + padding;
        }
    });


    this.contents.setPosition(oldPos);


    this.adjustScrollBars();
    Morph.prototype.trackChanges = oldFlag;
    this.changed();

    this.updateSelection();
};

/*
// Huan Song: Slightly modified version of the original WardrobeMorph reactToDropOf
ShareBoxAssetsMorph.prototype.reactToDropOf = function (icon) {
    // Primarily differs in preventing the costume from being removed from WardrobeMorph on sharing
    // as well avoiding costume duplication from dragging around inside ShareBoxAssetsMorph as a result
    // of the aforementioned

    // Returns sprite to the original location regardless of origin
    icon.slideBackTo(world.hand.grabOrigin, 10);
    // If sprite isn't from ShareBoxAssetsMorph, add costumes
    if (!(world.hand.grabOrigin.origin.parent instanceof ShareBoxAssetsMorph)) {
        var idx = 0,
            costume = icon.object,
            top = icon.top();
        //icon.destroy();
        this.contents.children.forEach(function (item) {
            if (item instanceof CostumeIconMorph && item.top() < top - 4) {
                idx += 1;
            }
        });
        this.sprite.costumes.add(costume, idx + 1);
        this.updateList();
        icon.mouseClickLeft(); // select
    } else {
        // Restore dragged costume
        this.sprite.costumes.add(icon.object);
        this.updateList();
        icon.mouseClickLeft();
        icon.destroy();
    }
};
*/

// ScriptIconMorph ///////////////////////////////////////////////////////

/*
 I am a script in the sharebox scripts
 */

// ScriptIconMorph inherits from ToggleButtonMorph (Widgets)
// ... and copies methods from SpriteIconMorph

ScriptIconMorph.prototype = new ToggleButtonMorph();
ScriptIconMorph.prototype.constructor = ScriptIconMorph;
ScriptIconMorph.uber = ToggleButtonMorph.prototype;
ScriptIconMorph.className = 'ScriptIconMorph';
// ScriptIconMorph settings

ScriptIconMorph.prototype.thumbSize = new Point(440, 50);
ScriptIconMorph.prototype.labelShadowOffset = null;
ScriptIconMorph.prototype.labelShadowColor = null;
ScriptIconMorph.prototype.labelColor = new Color(255, 255, 255);
ScriptIconMorph.prototype.fontSize = 14;

// ScriptIconMorph instance creation:

// aScript is a BlockMorph
function ScriptIconMorph(aScript, ide, aTemplate, scriptName) {
    this.init(aScript, ide, aTemplate, scriptName);
}

ScriptIconMorph.prototype.init = function (aScript, ide, aTemplate, scriptName) {
    var colors, action, query;
    this.ide = ide;
    this.isTemplate = true;
    if (!aTemplate) {
        colors = [
            IDE_Morph.prototype.groupColor,
            IDE_Morph.prototype.frameColor,
            IDE_Morph.prototype.frameColor
        ];

    }
    this.name = scriptName;
    action = function () {
        nop(); // When I am selected (which is never the case for sounds)
    };

    query = function () {
        return false;
    };

    // additional properties:
    //var ide = this.parentThatIsA('IDE_Morph');
    this.object = this.ide.sharer.serializeItem(aScript); // mandatory, actually
    this.version = this.object.version;
    this.thumbnail = null;

    // initialize inherited properties:
    ScriptIconMorph.uber.init.call(
        this,
        colors, // color overrides, <array>: [normal, highlight, pressed]
        null, // target - not needed here
        action, // a toggle function
        this.object.name, // label string
        query, // predicate/selector
        null, // environment
        null, // hint
        aTemplate // optional, for cached background images
    );

    // override defaults and build additional components
    this.isDraggable = true;
    this.createThumbnail(aScript.name);
    this.padding = 2;
    this.corner = 8;
    this.fixLayout();
    this.fps = 1;
};

ScriptIconMorph.prototype.createThumbnail = function (scriptName) {
    if (this.thumbnail) {
        this.thumbnail.destroy();
    }

    // script box style and position
    this.thumbnail = new FrameMorph();
    this.thumbnail.corner = 25;
    this.thumbnail.color = new Color(138, 138, 138);
    this.thumbnail.setExtent(this.thumbSize);
    this.thumbnail.acceptsDrops = false;

    // script name style and position
    txt = new TextMorph(scriptName);
    txt.setLeft(this.thumbnail.left() + 15);
    txt.setTop(this.thumbnail.top() + 15);
    txt.setFontSize(16);
    txt.isBold = true;
    txt.setColor(new Color(255, 255, 255));
    this.thumbnail.add(txt);
    txt.drawNew();

    this.add(this.thumbnail);
};

// ScriptIconMorph stepping

/*
 ScriptIconMorph.prototype.step
 = SpriteIconMorph.prototype.step;
 */

// ScriptIconMorph layout

ScriptIconMorph.prototype.fixLayout
    = SpriteIconMorph.prototype.fixLayout;

// ScriptIconMorph menu

ScriptIconMorph.prototype.userMenu = function () {
    var menu = new MenuMorph(this);
    menu.addItem('rename', 'renameScript');
    menu.addItem('delete', 'removeScript');
    //if (this.parent instanceof shareBox
    return menu;
};

ScriptIconMorph.prototype.renameScript = function () {
    var script = this.object,
        ide = this.ide,
        myself = this;
    (new DialogBoxMorph(
        null,
        function (answer) {
            if (answer && (answer !== script.name)) {
                script.name = answer;
                script.version = Date.now();
                myself.createLabel(); // can be omitted once I'm stepping
                myself.fixLayout(); // can be omitted once I'm stepping
                ide.hasChangedMedia = true;
            }
        }
    )).prompt(
        'rename script',
        script.name,
        this.world()
    );
};

ScriptIconMorph.prototype.removeScript = function () {
    var jukebox = this.parentThatIsA('ShareBoxScriptsMorph'),
        idx = this.parent.children.indexOf(this);
    jukebox.removeScript(idx);
    if ((this.parent.parent instanceof ShareBoxScriptsMorph)) {
        var ide = this.parentThatIsA('IDE_Morph');
        ide.sharer.socket.emit('REMOVE_ITEM',
            { room: ide.sharer.room,
                data: {name: this.name}
            });
        ide.createShareBox();
        ide.hasChangedMedia = true;
        ide.drawNew();
        ide.fixLayout();
    }
};

ScriptIconMorph.prototype.createBackgrounds
    = SpriteIconMorph.prototype.createBackgrounds;

ScriptIconMorph.prototype.createLabel
    = SpriteIconMorph.prototype.createLabel;

// ScriptIconMorph drag & drop

ScriptIconMorph.prototype.prepareToBeGrabbed = function () {
    this.removeScript();
};

// ShareBoxScriptsMorph /////////////////////////////////////////////////////

/*
 I am ShareBoxScriptsMorph, like WardrobeMorph, but for sounds
 */

// ShareBoxScriptsMorph instance creation

ShareBoxScriptsMorph.prototype = new ScrollFrameMorph();
ShareBoxScriptsMorph.prototype.constructor = ShareBoxScriptsMorph;
ShareBoxScriptsMorph.uber = ScrollFrameMorph.prototype;
ShareBoxScriptsMorph.className = 'ShareBoxScriptsMorph';

function ShareBoxScriptsMorph(aSprite, ide, sliderColor) {
    this.init(aSprite, ide, sliderColor);
}

ShareBoxScriptsMorph.prototype.init = function (aSprite, ide, sliderColor) {
    // additional properties
    this.sprite = aSprite || new SpriteMorph();
    this.costumesVersion = null;
    this.spriteVersion = null;
    this.ide = ide;

    // initialize inherited properties
    ShareBoxScriptsMorph.uber.init.call(this, null, null, sliderColor);

    // configure inherited properties
    this.acceptsDrops = false;
    this.fps = 2;
    this.updateList();
};

// Jukebox updating

ShareBoxScriptsMorph.prototype.updateList = function () {
    var myself = this,
        x = this.left() + 20,
        y = this.top() + 20,
        padding = 4,
        oldFlag = Morph.prototype.trackChanges,
        icon,
        template,
        txt,
        ide = this.ide;
    this.changed();
    oldFlag = Morph.prototype.trackChanges;
    Morph.prototype.trackChanges = false;

    this.contents.destroy();
    this.contents = new FrameMorph(this);
    this.contents.acceptsDrops = false;
    this.contents.reactToDropOf = function (icon) {
        myself.reactToDropOf(icon);
    };
    this.addBack(this.contents);

    this.sprite.scriptsList.asArray().forEach(function (script) {
        template = icon = new ScriptIconMorph(script, ide, template, script.name);
        icon.setPosition(new Point(x, y));
        myself.addContents(icon);
        y = icon.bottom() + padding + 35;
    });

    Morph.prototype.trackChanges = oldFlag;
    this.changed();

    this.updateSelection();
};

ShareBoxScriptsMorph.prototype.updateSelection = function () {
    this.contents.children.forEach(function (morph) {
        if (morph.refresh) {
            morph.refresh();
        }
    });
    this.spriteVersion = this.sprite.version;
};

// Scriptbox ops

// Fix this remove
ShareBoxScriptsMorph.prototype.removeScript = function (idx) {
    this.sprite.scriptsList.remove(idx);
    this.updateList();
};

// Jukebox drag & drop

ShareBoxScriptsMorph.prototype.wantsDropOf = function (morph) {
    return morph instanceof CommandBlockMorph && (morph.parentThatIsA('ShareBoxScriptsMorph') == null);
};

// Fix this add
ShareBoxScriptsMorph.prototype.reactToDropOf = function (blockMorph) {
    if (this.wantsDropOf(blockMorph)) {
        var idx = 0,
            script = new ScriptIconMorph(blockMorph),
            top = script.top();

        blockMorph.destroy();
        this.contents.children.forEach(function (script) {
            if (script.top() < top - 4) {
                idx += 1;
            }
        });
        this.sprite.scriptsList.add(script, idx);
        this.add(script);
        this.updateList();
    } else {
        blockMorph.slideBackTo(world.hand.grabOrigin);
    }
};

