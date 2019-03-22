interface HouseSource {
    // 相册
    housePhoto: Array<string>;
    // 标题
    houseTitle: string;
    // 面积
    houseArea: number;
    // 赠送面积
    houseAreaPlus: number;
    // 售价
    housePrice: number;
    // 房屋类型 [0, 0, 0] = 1室0厅0卫 // [0, 1, 1] = 1室0厅0卫 // [1, 1, 1] = 2室0厅0卫 
    houseType: [number, number, number];
    // 房屋朝向
    houseOrientation: number;
    // 楼层 [1, 15] = 1层/共15层
    houseFloor: [number, number];
    // 门锁类型
    houseDoorLookType: number;
    // 有无电梯 1 有 0 五
    houseElevator: number;
    // 是否装修
    houseDecoration: number;
    // 地理位置
    houseLocation: HouseLocation;
}

interface HouseLocation {
    // 名称
    name: string;     // 例如： 重庆人民大礼堂
    // 详细地址
    address: string;  // 例如： 重庆市渝中区人民路173号
    // 经度
    latitude: number; // 例如： 29.56167
    // 纬度
    longitude: number;// 例如： 106.555
}