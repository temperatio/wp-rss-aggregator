<script>
  import ListTable from 'vue-wp-list-table/dist/vue-wp-list-table.common'
  import VSwitch from './VSwitch'
  import BottomPanel from './BottomPanel'

  export default {
    template: '#wpra-feed-items-template',
    data () {
      return {
        rowClassGetter: function (row) {
          return row.enabled ? 'feed-item-enabled' : ''
        },
        selected: [],
        columns: WpraFeed.columns,
        list: [{
          id: 247,
          enabled: true,
          photo: 'https://seeklogo.com/images/1/100-cotton-logo-EA8A40B364-seeklogo.com.png',
          title: 'Sports Network',
          url: 'https://www.feed.com/feed',
          update: {
            next: 16,
            last: 14,
            imported: 3,
          },
          imported: 32,
        },]
      }
    },
    components: {
      ListTable,
      VSwitch,
      BottomPanel,
    },
    methods: {
      checked (ids) {
        this.selected = ids
      }
    }
  }
</script>

<style lang="scss">
    .feed-list-table {
        td:first-child, th:first-child {
            border-left: 4px solid transparent;
        }
        .feed-item-enabled {
            td:first-child, th:first-child {
                border-left-color: #0085ba;
            }
        }
        .column.enabled {
            width: 3rem;
        }
    }
</style>