import React from "react"
import { Dimensions, Image, TouchableOpacity, View } from "react-native"
import { Button, Icon, List, Text } from "@ui-kitten/components"

export default ({ item, onCartPress, onItemPress }) => (
  <TouchableOpacity
    style={{
      flex: 1,
      margin: 3,
      borderRadius: 16,
      maxWidth: Dimensions.get("window").width / 2 - 24,
      alignSelf: "center",
      padding: 10,
      minHeight: 250
    }}
    onPress={() => onItemPress(item)}
  >
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 6
      }}
    >
      <Image
        style={{ height: 80 }}
        source={{ uri: item.image }}
        resizeMode="contain"
      />
      <View
        style={{
          flex: 1,
          padding: 16,
          justifyContent: "space-between"
        }}
      >
        <View>
          <Text category="s1">{item.name}</Text>
          <Text
            style={{ marginTop: 5 }}
            appearance="hint"
            status={item.stock < 1 ? "danger" : ""}
            category="c1"
          >
            {item.stock} in stock
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Icon name="award-outline" width={17} height={17} fill="#8f9bb3" />
            <Text
              category="s1"
              appearance="hint"
              style={{
                marginLeft: 3
              }}
            >
              {item.price}
            </Text>
          </View>
          <Button
            disabled={item.disabled}
            style={{ paddingHorizontal: 0 }}
            size="small"
            icon={style => <Icon {...style} name="shopping-cart" />}
            onPress={() => onCartPress(item)}
          />
        </View>
      </View>
    </View>
  </TouchableOpacity>
)
