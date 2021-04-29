let a = [
  [
    {
      userId: "607b99348f2d3500151f091d",
      permissionId: "606318bbae23812268265f1d",
    },
    {
      userId: "607b99348f2d3500151f091d",
      permissionId: "606318bbae23812268265f1e",
    },
    {
      userId: "607b99348f2d3500151f091d",
      permissionId: "606318bbae23812268265f1f",
    },
    {
      userId: "607b99348f2d3500151f091d",
      permissionId: "606318bbae23812268265f20",
    },
  ],
  [
    {
      userId: "607b9ffa8f2d3500151f0940",
      permissionId: "606318bbae23812268265f1d",
    },
    {
      userId: "607b9ffa8f2d3500151f0940",
      permissionId: "606318bbae23812268265f1e",
    },
    {
      userId: "607b9ffa8f2d3500151f0940",
      permissionId: "606318bbae23812268265f1f",
    },
    {
      userId: "607b9ffa8f2d3500151f0940",
      permissionId: "606318bbae23812268265f20",
    },
  ],
  [
    {
      userId: "608377be69db9e00153d75ba",
      permissionId: "606318bbae23812268265f1d",
    },
    {
      userId: "608377be69db9e00153d75ba",
      permissionId: "606318bbae23812268265f1e",
    },
    {
      userId: "608377be69db9e00153d75ba",
      permissionId: "606318bbae23812268265f1f",
    },
    {
      userId: "608377be69db9e00153d75ba",
      permissionId: "606318bbae23812268265f20",
    },
  ],
  [
    {
      userId: "6084d84bd9eb98001525f883",
      permissionId: "606318bbae23812268265f1d",
    },
    {
      userId: "6084d84bd9eb98001525f883",
      permissionId: "606318bbae23812268265f1e",
    },
    {
      userId: "6084d84bd9eb98001525f883",
      permissionId: "606318bbae23812268265f1f",
    },
    {
      userId: "6084d84bd9eb98001525f883",
      permissionId: "606318bbae23812268265f20",
    },
  ],
];
a = a.reduce((init, cur) => {
  //   console.log(cur);
  //   console.log(init);
  init.push(...cur);
  return init;
}, []);
console.log(a);
