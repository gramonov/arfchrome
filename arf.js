/*
 * arf.js     v0.0.1
 *
 * Anti-regret Filter (ARF) is a chrome extension for gmail that prevents
 * users from sening angry emails they will regret later.
 */

/** Main user endpoint. */
var ARF = ARF || {VERSION: '0.0.1'};

/** Controls extension execution. */
var ARF.main = (function() {

    // private
    
    /** Period at which check if gmail is loaded. */
    var gmailLoadInterval = 300;

    /** Gmail load condition: when loading display is finally hidden. */
    function gmailLoadCondition() {
        $("#loading").css("display") === "none";
    }

    /** Start the main execution of the extension. */
    function loadExtension() {
        var composeBtnDiv = ARF.utilities.findByInnerText("COMPOSE");
        
    }

    // public
    
    return {

        /** Start the extension. */
        start: function() {
            ARF.utilities.callWhenSatisfied(
                gmailLoadCondition,
                loadExtension,
                gmailLoadInterval
            )
        }
    }
}());

/** Controls user interactions with the gmail message box. */
var ARF.typecontrol = (function() {

    // private
    
    /** Current content of the email message box. */
    var content;

    /** Typing interval timeout. */
    var done

    /** Function to call when the user is done typing. */
    function doneTyping() {
        ARF.scorecontrol.updateScore();
    }
    
    // public
    
    return {

        /** Tracks message box. */
        function trackTyping: function() {
            var typingTimer;
        
            composeBtnDiv.click(function() {
                var composeWindowChecker = function() {               
                    if ($("div[aria-label='Message Body']") !== null) {
                        $("div[aria-label='Message Body']")
                            .on('focus', function() {
                                var $this = $(this);
                                $this.data('before', $this.html());
                                return $this;
                            }).on('blur keyup paste', function() {
                                var $this = $(this);
                                if ($this.data('before') !== $this.html()) {
                                    $this.data('before', $this.html());
                                    $this.trigger('change');
                                }
                                return $this;
                            }).on('change', function() {
                                var content = $(this).text();
                                clearTimeout(typingTimer);
                                typingTimer = setTimeout(function() {
                                    doneTyping(content);
                                },
                                                         2500);
                            });
                        window.clearInterval(timer);
                    }
                }
                var timer = window.setInterval(composeWindowChecker, 100);
            });
        }
    }
}());

/** Controls methods associated with displaying and calculating regret score. */
var ARF.scorecontrol = (function() {

    // private

    /** Tooltip delay. */
    var tooltipDelay = 600;

    /** Seal picture path. */
    var sealImgPath = chrome.extension.getURL( "seal.jpg" );

    /** User stats. */
    var stats = {
        sentiment: "rude",
        tspeed: 64,
        corrections: 12,
        misspellings: 2,
        rude: 11
    }

    /** Creates tooltip from the given user stats. */
    function buildTooltip( stats ) {
        return "<div class='arf-tooltip' style='display:none;'><p>sentiment: "
            + stats.sentiment
            + "</p><p>typing speed: "
            + stats.tspeed
            + "</p><p>corrections: "
            + stats.corrections
            + " </p><p>misspellings: "
            + stats.misspellings
            + "</p><p>rude words: "
            + stats.rude
            + "</p></div>";
    }

    /** Calculate arf score based on the stats. */
    function calculateArfScore() {
        return "13";
    }

    /** Show tooltip. */
    function showTooltip() {
        $( "body" ).append( tooltip );
        $( "#arf-score" ).hover( function() {
            $( ".arf-tooltip" ).fadeIn( tooltipDelay, "easeInExpo" );
        }).mouseleave( function() {
            $( ".arf-tooltip" ).hide();
        });
    }

    /** Show arf warning if the score is too low. */
    function showWarning() {
        var sendBtnDiv = ARF.utilities.findByInnerText( "Send" );
        var newSendBtnDiv = sendBtnDiv.clone()
            .css( "float", "right" )
            .attr( "id", "custom-send" );
        $("body").append("<div class='arf-warning' style='display:none;'>"
                         + "<p style='font-size:16px; text-align:center;'>"
                         + "ARF! Are you sure?</p><img src='"
                         + sealImgPath
                         + "' class='arf-seal'></div>");
        $( ".arf-warning" ).fadeIn( tooltipDelay, "easeInExpo" )
            .append(newSendBtnDiv);
        newSendBtnDiv.click( function() {
            $( "arf-warning" ).hide();
            sendBtnDiv.click();
        });
        sendBtnDiv.hide();
    }
    
    // public
    
    return {

        /** Updates arfscore or creates it if it's not there. */
        function updateScore() {
            var arfScore = calculateArfScore();
            if ( $( "#arf-score" ).length ) {
                $( "#arf-score" ).html( arfScore );
            } else {
                $("<td class='arf-score-wrapper'><span id='arf-score'>"
                  + arfScore + "</span></td>")
                    .insertBefore(sendBtnDiv.closest("td").siblings().last());
                var tooltip = buildTooltip( stats );
                showTooltip( tooltip );
            }
            showWarning();
        }
    }
}());

/** Helper functions for accessing DOM. */
var ARF.utilities = (function() {

    // public
    return {
        
        /** Find the innermost element by it's inner TEXT. */ 
        findByInnerText: function( text ) {
            return $("div:contains('" + text + "')")
                .filter(function() {
                    return $(this).html() === text;
                });
        },

        /** Check if CONDITION is satisfied every INTERVAL seconds.
          * Then, call the function FN. */
        callWhenSatisfied: function( condition, fn, interval ) {
            var repeater = function() {
                if ( condition() ) {
                    fn();
                    clearInterval( timer );
                }
            };
            var timer = setInterval( repeater, interval ); 
        }
    }
}());

// execute main script
var executeScript = function() {
    
        // find compose button
        
        
    });
};
