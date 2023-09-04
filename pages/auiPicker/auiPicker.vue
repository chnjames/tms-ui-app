<template>
	<view class="content">
		<view class="aui-content">
			<view class="aui-btn aui-btn-blue" @click.stop="showPicker($event)">picker无限级联动</view>
		</view>
		<aui-picker
			ref="picker"
			:title="auiPicker.title"
			:layer="auiPicker.layer"
			:data="auiPicker.data"
			@callback="pickerCallback"
		></aui-picker>
	</view>
</template>

<script>
	import auiPicker from '@/components/aui-picker/aui-picker.vue';
	export default {
		components: {
			auiPicker
		},
		data() {
			return {
				auiPicker: {
					title: '',
					layer: null,
					data: []
				}
			}
		},
		created(){

		},
		mounted() {

		},
		methods: {
			//显示picker多级联动弹窗
			showPicker(e){
				const _this = this;
				_this.auiPicker.data=[{
					id: "1001",
					name: "一级菜单1",
					children: [{
						id: "1002",
						name: "二级菜单1-1",
						children: [{
							id: "1003",
							name: "三级菜单1-1",
							children: [{
								id: "1004",
								name: "四级菜单1-1"
							}]
						}]
					}]
				},
				{
					id: "1005",
					name: "一级菜单2",
					children: [{
						id: "1006",
						name: "二级菜单2-1",
						children: [{
							id: "1007",
							name: "三级菜单2-1",
							children: [{
								id: "1008",
								name: "四级菜单2-1"
							}]
						}]
					}]
				}];
				_this.$refs.picker.open().then(function(){
					console.log('picker打开');
				});
			},
			//picker多级联动回调
			pickerCallback(e){
				const _this = this;
				console.log(e);
				let result = '';
				e.data.forEach(function(item, index){
					result += item.name + '   ';
				});
        console.log('result', result)
				uni.showModal({
				    title: '提示',
				    content: result,
				    success: function (res) {
				        if (res.confirm) {
				            console.log('用户点击确定');
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			}
		}
	}
</script>

<style>
	.aui-content{padding: 15px 0 0 0;}
</style>
