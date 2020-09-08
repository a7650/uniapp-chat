import messageManager from '@/common/mixins/messageManager'
import { mapGetters } from 'vuex'

export default {
    mixins: [messageManager],
    props: {
        message: {
            type: Object,
            default() {
                return null
            }
        }
    },
    computed: {
        ...mapGetters(['ownedId']),
        isOwned() {
            return this.message && (this.message.senderId === this.ownedId)
        }
    }
}
