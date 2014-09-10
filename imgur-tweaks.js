(function () {
    $(document).ready(function () {
        console.log('Letting the cats out...');
        
        var captionTimer;
        
        function showCaption(event) {
            $(document).off('keydown', checkKeyShowCaption);

            $('#image-title').off('DOMSubtreeModified');
            // restore caption
            $('#image-title').html($('#image-title').data('caption')).css('display', 'inline-block');
            // support for album title
            $('#image h2.album-title, #image div.description').each(function (index, element) {
                element = $(element);
                element.html(element.data('title')).show();
            });
            
            $('#showCaption').hide();
            
            $('#image-title').on('DOMSubtreeModified', handlePageChange);
        }
        
        function updateTimer(time) {
            console.log('in updateTimer... time:', time);
            $('#showCaption span.seconds').html(time);
            if (time <= 0) {
                $('#showCaption a').click();
                $('#showCaption span.seconds').html('10');
            } else {
                captionTimer = setTimeout(function () {
                    updateTimer(--time);
                }, 1000);
            }
        }
        
        function handlePageChange () {
            var tmpCaption = $('#image-title').html();
            if (tmpCaption !== '') {
                // update the caption
                $('#image-title').data('caption', tmpCaption).empty().hide();
                $('#image h2.album-title, #image div.description').each(function (index, element) {
                    element = $(element);
                    element.data('title', element.html()).empty().hide();
                });
                
                // allow user to unhide caption, and start timer to automatically show
                $('#showCaption').show();
                clearTimeout(captionTimer);
                $('#showCaption span.seconds').html('10');
                captionTimer = setTimeout(function () {
                    updateTimer(9);
                }, 1000);
                
                $(document).on('keydown', checkKeyShowCaption);
            }
        }

        function checkKeyShowCaption(event) {
            switch (event.keyCode) {
                case 38: // up arrow
                case 33: // page up
                case 36: // home
                    showCaption(event);
                default:
                    // nothing
            }
        }
        
        function checkViewMore() {
            console.log('checkViewMore...');
            if ($('#album-truncated a').is(':visible')) {
                console.log('showing more images!');
                $('#album-truncated a').click();
            }
        }
        
        // insert show caption link and hide caption
        $('#image-title').data('caption', $('#image-title').html()).empty().hide().after('<h2 id="showCaption"><a href="#">Show Caption</a> <span class="timer"><small>Automatically showing in <span class="seconds">10</span> seconds...</small></span></h2>');
        // support for album title and description
        $('#image h2.album-title, #image div.description').each(function (index, element) {
            element = $(element);
            element.data('title', element.html()).empty().hide();
        });
    
        $(document).on('click', '#showCaption a', showCaption);
        
        // DOMSubtreeModified deprecated... but not really since there is no alternative...
        // going to keep using until we come up with a solution.
        $('#image-title').on('DOMSubtreeModified', handlePageChange);
        
        captionTimer = setTimeout(function () {
            updateTimer(9);
        }, 1000);
        
        $(document).on('keydown', checkKeyShowCaption);
        
        // automatically view more images
        // not working atm, I think it has to do with the extension not having access to events the
        // regular page has.
        //setInterval(checkViewMore, 1000);

        console.log("The Fairies, too!");

        Fairy = (function() {
            return {
                downvote: function () {
                    $('div.arrow.down').each(function(index, element) {
                        element = $(element);
                        if (!element.hasClass('pushed')) {
                            element.click();
                        }
                    });
                    return this;
                },
                upvote: function () {
                    $('div.arrow.up').each(function(index, element) {
                        element = $(element);
                        if (!element.hasClass('pushed')) {
                            element.click();
                        }
                    });
                    return this;
                },
                scrollBottom: function () {
                    $("html, body").animate({ scrollTop: $(document).height()-$(window).height() });
                    return this;
                },
                interval: null
            }
        }());

        var controls = [
            '<div id="fairies" style="position: fixed; bottom: 0; right: 0;">',
                '<button id="nuke-it" style="margin: 5px; padding: 5px">Nuke it from orbit!</button>',
                '<button id="all-the-points" style="margin: 5px; padding: 5px;">All the points!</button>',
            '</div>'
        ].join('');

        $.when($('#content').append(controls)).then(function () {
            $('#nuke-it').on('click', function () {
                var element = $(this);
                if (!element.hasClass('active')) {
                    element.addClass('active');
                    Fairy.downvote().scrollBottom();
                    Fairy.interval = setInterval(function () {
                        Fairy.downvote().scrollBottom();
                    }, 3000);
                    element.html('Cease fire!');
                    $('#all-the-points').attr('disabled', 'disabled');
                } else {
                    element.removeClass('active').html('Nuke it from orbit!');
                    clearInterval(Fairy.interval);
                    $('#all-the-points').removeAttr('disabled');
                }
            });

            $('#all-the-points').on('click', function () {
                var element = $(this);
                if (!element.hasClass('active')) {
                    element.addClass('active');
                    Fairy.upvote().scrollBottom();
                    Fairy.interval = setInterval(function () {
                        Fairy.upvote().scrollBottom();
                    }, 3000);
                    element.html('That\'s enough!');
                    $('#nuke-it').attr('disabled', 'disabled');
                } else {
                    element.removeClass('active').html('All the points!');
                    clearInterval(Fairy.interval);
                    $('#nuke-it').removeAttr('disabled');
                }
            });
        });
    });
}());
