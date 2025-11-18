# Degrees-of-Lewdity
- <img decoding="async" src="https://gitgud.io/uploads/-/system/user/avatar/9096/avatar.png" width="24" alt=""> <b>遊戲作者</b> $\color{purple} {Vrelnir}$
  - [Vrelnir 的blog][blog]
  - [英文遊戲維基][wiki-en]
  - [中文英文遊戲維基][wiki-cn]
  - [官方 Discord][discord]
  - [遊戲源碼倉庫][gitgud]

# 需求  
* 需要搭配[MODLOADER][JML]使用  
* 需搭配[Degrees of Lewdity 中文本地化][DOLCN]使用  
* 需搭配[Simple Framework][SF]或[maplebirchframework][MF]使用

# 貝利瘋狂爆金幣MOD
**功能：**  
* **為Degrees-of-Lewdity新增要素：**
  * 貝利租金欠款新增累積制模式，本週沒收到的欠款將累計至下週，逐週累計，直到PC被貝利找到觸發還款事件為止。  
  * 孤兒院辦公室增加貝利的保險箱，可以嘗試爆貝利金幣。  
  
![img](https://github.com/chris81605/Degrees-of-Lewdity_Bailey_rent_mod/blob/main/preview.jpg)
# 更新日誌
**2.0.1**  
1. 增加對[maplebirchframework][MF]的兼容性  
 
2. 嘗試檢測使用者是否正確安裝前置框架，到檢測不到任一前置框架或是版本過低時將彈窗提示。    
* 使用者沒安裝`simple framework`、或`maplebirch framework`或安裝框架版本低於要求：  
    (1)版本不符合需求 => 彈窗警告  
    (2)沒裝必要框架 => 不執行相關模組註冊動作  
    
**2.0** 
1. 重新命名模組為`貝利瘋狂爆金幣MOD`  
2. 重構核心代碼  
3. 使用簡易框架與降低依賴原版代碼修改  
4. 合併`貝利的小金庫`模組，現在你可以和貝利互相傷害了！  


**1.3.1**  
* 移除貝利小金庫兼容相關代碼（將使用其他方式獲取正確租金）  

**1.3.0**  
* 修複0.4.5.3日誌顯示異常  
  
**1.2.0**
* 租金累積計算方式變更
    * 依據rentstage累加
    * 每躲債一週renstage加1(例如：開新檔即開始躲債，遊戲時間三週時，欠款為100+300+500)
* 增加對貝利的小金庫取回租金兼容  

**1.1.0**  
* 計算邏輯分離  

**1.0.2**  
* 取消不必要的全局變量  
* 嘗試優化代碼(失敗，代碼還多了三行QAQ)  

**1.0.1**  
* 初版

[blog]: https://vrelnir.blogspot.com/
[wiki-en]: https://degreesoflewdity.miraheze.org/wiki
[wiki-cn]: https://degreesoflewditycn.miraheze.org/wiki
[gitgud]: https://gitgud.io/Vrelnir/degrees-of-lewdity/-/tree/master/
[discord]: https://discord.gg/VznUtEh
[JML]:https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader  
[DOLCN]:https://github.com/Eltirosto/Degrees-of-Lewdity-Chinese-Localization  
[SF]:https://github.com/emicoto/DOLMods 
[MF]:https://github.com/MaplebirchLeaf/SCML-DOL-maplebirchframework