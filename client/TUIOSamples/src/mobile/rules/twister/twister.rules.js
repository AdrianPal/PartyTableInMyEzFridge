/**
 * @author: Adrian PALUMBO  
 */
import MobileHandler from '../../mobile.handler';

const config = require('../../../../config');

export default class TwisterRules extends MobileHandler {

    static get currentFolder() {
        return '/src/mobile/rules/twister';
    }

    constructor(gameId, pos, user) {
        super(gameId, pos);

        this.user = user;

        if (this.user !== undefined && this.user !== null) {
            this.updateView();
        } else {
            this.updateViewAndRetrieveUser();
        }
    }

    updateViewAndRetrieveUser() {
        const that = this;

        $.get(config.server + '/api/user/' + this.gameId + '/' + this.pos)
            .done(function (d) {
                console.log(d);
                that.user = d;

                // The user exists for the current pos and game
                return that.updateView();
            })
            .fail(function (e) {
                // New user for game and pos
                that.createNewLoginView();
            });
    }

    updateView() {
        const that = this;

        this.updateTitle('Twister\'s rules');

        $.ajax({
            type: "GET",
            url: TwisterRules.currentFolder + '/twister.rules.view.html',
            success: function (text) {
                that.updateContent(text);

                that.setListeners();
            }
        });
    }

    triggerClick(elem) {
        $(elem).click();
    }

    setListeners() {
        let $progressWizard = $('.stepper'),
            $tab_active,
            $tab_prev,
            $tab_next,
            $btn_prev = $progressWizard.find('.prev-step'),
            $btn_next = $progressWizard.find('.next-step'),
            $restart = $progressWizard.find('.restart'),
            $tab_toggle = $progressWizard.find('[data-toggle="tab"]'),
            $tooltips = $progressWizard.find('[data-toggle="tab"][title]');

        const that = this;

        // To do:
        // Disable User select drop-down after first step.
        // Add support for payment type switching.

        //Initialize tooltips
        $tooltips.tooltip();

        //Wizard
        $tab_toggle.on('show.bs.tab', function (e) {
            var $target = $(e.target);

            if (!$target.parent().hasClass('active, disabled')) {
                $target.parent().prev().addClass('completed');
            }
            if ($target.parent().hasClass('disabled')) {
                return false;
            }
        });
        
        $btn_next.on('click', function () {
            $tab_active = $progressWizard.find('.active');

            $tab_active.next().removeClass('disabled');

            $tab_next = $tab_active.next().find('a[data-toggle="tab"]');
            that.triggerClick($tab_next);

        });

        $restart.on('click', function () {
            $progressWizard.find('active').addClass('disabled');

            $tab_next = $progressWizard.find('a[aria-controls="stepper-step-1"]');

            $progressWizard.find('.nav.nav-tabs li').removeClass('completed');
            that.triggerClick($tab_next);
        });

        $btn_prev.click(function () {
            $tab_active = $progressWizard.find('.active');
            $tab_prev = $tab_active.prev().find('a[data-toggle="tab"]');
            that.triggerClick($tab_prev);
        });
    }
}