enum DiscountConditionType {
  PRODUCTS = "products",
  PRODUCT_TYPES = "product_types",
  PRODUCT_COLLECTIONS = "product_collections",
  PRODUCT_TAGS = "product_tags",
  CUSTOMER_GROUPS = "customer_groups",
}

export const getTitle = (view: DiscountConditionType) => {
  switch (view) {
    case DiscountConditionType.PRODUCTS:
      return "productos"
    case DiscountConditionType.CUSTOMER_GROUPS:
      return "grupos de clientes"
    case DiscountConditionType.PRODUCT_TAGS:
      return "tags"
    case DiscountConditionType.PRODUCT_COLLECTIONS:
      return "colecciones"
    case DiscountConditionType.PRODUCT_TYPES:
      return "tipos"
  }
}
