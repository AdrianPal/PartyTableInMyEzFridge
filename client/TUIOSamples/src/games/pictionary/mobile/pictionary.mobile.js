import MobileHandler from '../../../mobile/mobile.handler'



export default class PictionaryMobile extends MobileHandler {
    constructor(gameId, pos, isChoosenMobile) {
        super(gameId, pos);


        alert((isChoosenMobile == true) ? 'This is the chosen mobile' : 'This is not the chosen mobile');
    }   
}