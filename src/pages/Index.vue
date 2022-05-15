<template>
  <div style="width: 100%; height: 60vw">
    <q-carousel
      swipeable
      animated
      v-model="slide"
      thumbnails
      infinite
      arrows
      transition-prev="slide-right"
      transition-next="slide-left"
      :autoplay="autoplay"
      @mouseenter="autoplay = false"
      @mouseleave="autoplay = true"
      height="100%"
    >
      <q-carousel-slide v-for="(ad) in advertiseList" :name=ad.id :img-src="picUrl + ad.picture" style="height: 100%"></q-carousel-slide>
<!--      <q-carousel-slide :name="10" img-src="https://cdn.quasar.dev/img/mountains.jpg" />-->
<!--      <q-carousel-slide :name="20" img-src="https://cdn.quasar.dev/img/parallax1.jpg" />-->
<!--      <q-carousel-slide :name="30" img-src="https://cdn.quasar.dev/img/parallax2.jpg" />-->
<!--      <q-carousel-slide :name="40" img-src="https://cdn.quasar.dev/img/quasar.jpg" />-->
    </q-carousel>
  </div>
  <q-table
    title="图书信息"
    :rows="bookList"
    :columns="columns"
    rows-per-page-label="每页记录数"
    :visible-columns="visibleColumns"
  >
    <template v-slot:top v-if="$q.screen.lt.md">
      <div style="width: 100%; display: flex; flex-direction: column; justify-content: space-around; align-items: stretch;">
        <div class="q-pa-md">
          <q-btn-group spread>
            <q-btn color="info" label="我要买书" icon="ion-heart" style="width: 50%" @click="querySale"/>
            <q-btn color="secondary" label="我要卖书" icon="ion-bulb" style="width: 50%" @click="queryPurchase"/>
          </q-btn-group>
        </div>
        <q-input color="purple-12" v-model="queryForm.name" label="书名" clearable>
          <template v-slot:prepend>
            <q-icon name="event"/>
          </template>
        </q-input>
        <q-select color="purple-12" v-model="queryForm.press" :options="pressList" label="出版社" style="100%"
                  clearable>
          <template v-slot:prepend>
            <q-icon name="event"/>
          </template>
        </q-select>
        <q-select color="purple-12" v-model="queryForm.category" :options="categoryList" label="分类" style="100%"
                  clearable>
          <template v-slot:prepend>
            <q-icon name="event"/>
          </template>
        </q-select>
        <q-space/>
        <q-btn style="width: 100%;" :ripple="{ center: true }" color="secondary" label="重置条件"
               no-caps @click="clearForm"/>
        <q-btn :loading="loading" color="primary" @click="getBooks" style="width: 100%">
          搜索
          <template v-slot:loading>
            <q-spinner-hourglass class="on-left"/>
            加载中...
          </template>
        </q-btn>
      </div>
    </template>
    <template v-slot:top v-if="$q.screen.gt.sm">
        <q-btn-group spread style="display:block; width: 100%">
          <q-btn color="info" label="我要买书" icon="ion-heart" style="width: 50%" @click="querySale"/>
          <q-btn color="secondary" label="我要卖书" icon="ion-bulb" style="width: 50%" @click="queryPurchase"/>
        </q-btn-group>
        <q-input color="purple-12" v-model="queryForm.name" label="书名" clearable>
          <template v-slot:prepend>
            <q-icon name="label"/>
          </template>
        </q-input>
        <q-select color="purple-12" v-model="queryForm.press" :options="pressList" label="出版社" style="width: 200px"
                  clearable>
          <template v-slot:prepend>
            <q-icon name="reorder"/>
          </template>
        </q-select>
        <q-select color="purple-12" v-model="queryForm.category" :options="categoryList" label="分类" style="width: 200px"
                  clearable>
          <template v-slot:prepend>
            <q-icon name="reorder"/>
          </template>
        </q-select>
        <q-space/>
        <q-btn style="width: 150px; margin-right: 20px" :ripple="{ center: true }" color="secondary" label="重置条件"
               no-caps @click="clearForm"/>
        <q-btn :loading="loading" color="primary" @click="getBooks" style="width: 150px">
          搜索
          <template v-slot:loading>
            <q-spinner-hourglass class="on-left"/>
            加载中...
          </template>
        </q-btn>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="isbn" :props="props">
          {{ props.row.isbn }}
        </q-td>
        <q-td key="name" :props="props">
          {{ props.row.name }}
        </q-td>
        <q-td key="picture" :props="props">
          <q-img
            :src="picUrl + props.row.picture"
            style="width: 100px"
          ></q-img>
        </q-td>
        <q-td key="categoryName" :props="props">
          {{ props.row.categoryName }}
        </q-td>
        <q-td key="pressName" :props="props">
          {{ props.row.pressName }}
        </q-td>
        <q-td key="salePrice" :props="props">
          {{ parseFloat(props.row.salePrice).toFixed(2) }}
        </q-td>
        <q-td key="purchasePrice" :props="props">
          {{ parseFloat(props.row.purchasePrice).toFixed(2) }}
        </q-td>
<!--        <q-td key="purchasePrice" :props="props" v-if="queryForm.isPurchase !== ''">-->
<!--          {{ parseFloat(props.row.purchasePrice).toFixed(2) }}-->
<!--        </q-td>-->
        <q-td key="inventory" :props="props">
          {{ props.row.inventory }}
        </q-td>
        <q-td key="des" :props="props">
          {{ props.row.des }}
        </q-td>
      </q-tr>
    </template>
    <template v-slot:no-data="{ icon, message, filter }">
      <div class="full-width row flex-center text-accent q-gutter-sm">
        <q-icon size="2em" name="sentiment_dissatisfied" />
        <span>
            非常抱歉... 没有找到相关内容
          </span>
        <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
      </div>
    </template>
  </q-table>

</template>

<script>
import {defineComponent, reactive, ref} from 'vue';
import {api} from "boot/axios"

export default defineComponent({
  name: 'PageIndex',
  setup() {
    const router = ref(0);
    const center = {
      display: 'flex',
      'flex-direction': 'column',
      'justify-content': 'space-around',
      'align-items': 'center'
    }
    const loading = ref(false)
    const page = ref(1)
    const size = ref(10)
    const bookList = ref([])
    const pressList = ref([])
    const categoryList = ref([])
    const advertiseList = ref([])
    const picUrl = 'http://124.221.104.172:9999/erupt-attachment'
    const visibleColumns = ref(['isbn', 'name', 'picture', 'categoryName', 'inventory', 'des', 'salePrice'])
    const queryForm = ref({
      isSale:true,
      isPurchase:''
    })
    const querySale = async () => {
      queryForm.value.isSale = true
      queryForm.value.isPurchase = ''
      visibleColumns.value.splice(visibleColumns.value.length-1, 1)
      visibleColumns.value.push('salePrice')
      await getBooks()
    }
    const queryPurchase = async () => {
      queryForm.value.isSale = ''
      queryForm.value.isPurchase = true
      visibleColumns.value.splice(visibleColumns.value.length-1, 1)
      visibleColumns.value.push('purchasePrice')
      await getBooks()
    }
    const getAdvertise = async () => {
      const {data: res} = await api.get('/advertise')
      advertiseList.value = res.data
      console.log(advertiseList.value)
    }
    const getCategory = async () => {
      const {data: res} = await api.get('/category')
      res.data.forEach((value, index, array) => {
        categoryList.value.push({label: value.name, value: value.id})
      })
    }
    const getPress = async () => {
      const {data: res} = await api.get('/press')
      console.log(res);
      res.data.forEach((value, index, array) => {
        pressList.value.push({label: value.name, value: value.id})
      })
    }
    const getBooks = async () => {
      loading.value = true
      let form = {}
      form = {...queryForm.value}
      if (queryForm.value.press != null) {
        form.press = queryForm.value.press.value + ''
      }
      if (queryForm.value.category != null) {
        form.category = queryForm.value.category.value + ''
      }
      const {data: res} = await api.post('/book/search/' + page.value + '/' + size.value, form)
      bookList.value = res.data.rows
      loading.value = false
    }
    const clearForm = () => {
      queryForm.value = {}
    }
    const columns = [
      {
        name: 'isbn',
        label: 'ISBN',
        field: 'isbn',
        align: 'center'
      },
      {
        name: 'name',
        label: '书名',
        field: 'name',
        align: 'center'
      },
      {
        name: 'picture',
        label: '图片',
        field: 'picture',
        align: 'center'
      },
      {
        name: 'categoryName',
        label: '分类',
        field: 'category',
        align: 'center'
      },
      {
        name: 'pressName',
        label: '出版社',
        field: 'press',
        align: 'center'
      },
      {
        name: 'salePrice',
        label: '出售价格',
        field: 'salePrice',
        align: 'center'
      },
      {
        name: 'purchasePrice',
        label: '收购价格',
        field: 'purchasePrice',
        align: 'center'
      },
      {
        name: 'inventory',
        label: '库存',
        field: 'inventory',
        align: 'center'
      },
      {
        name: 'des',
        label: '描述',
        field: 'des',
        align: 'center'
      }
    ]

    getAdvertise()
    getBooks()
    getPress()
    getCategory()
    return {
      router,loading, queryForm, picUrl, bookList, page, size, columns, pressList, categoryList, center,
      advertiseList,visibleColumns,
      getBooks, clearForm,querySale, queryPurchase,

      slide: ref(1),
      autoplay: ref(true)
    }
  }
})
</script>


