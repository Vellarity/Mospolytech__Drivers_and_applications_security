import { makeAutoObservable } from "mobx";

class Data {
    constructor(){
        makeAutoObservable(this)
    }

    data = {data:[]}
    oldData = {data:[]}
    searchData = undefined

    writeData(string) {
        this.data = JSON.parse(string)
    }

    writeOldData(string) {
        this.oldData = JSON.parse(string)
    }

    addData(url, login, password) {
        this.data.data.push({url:url, login:login, password:password})
    }

    findData(searchStr) {
        this.searchData = {data:this.data.data.filter(item => item.url.includes(searchStr))}
    }

    deleteData(index) {
        this.data.data.splice(index,1)
    }

    swapData() {
        this.oldData = this.data
    }
}
export default new Data()