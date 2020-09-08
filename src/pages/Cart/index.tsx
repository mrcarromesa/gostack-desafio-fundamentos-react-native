import React, { useMemo } from 'react';
import FeatherIcon from 'react-native-vector-icons/Feather';

import { View, ListRenderItem } from 'react-native';

import {
  Container,
  ProductContainer,
  ProductList,
  Product,
  ProductImage,
  ProductTitleContainer,
  ProductTitle,
  ProductPriceContainer,
  ProductSinglePrice,
  TotalContainer,
  ProductPrice,
  ProductQuantity,
  ActionContainer,
  ActionButton,
  TotalProductsContainer,
  TotalProductsText,
  SubtotalValue,
} from './styles';

import { useCart } from '../../hooks/cart';

import formatValue from '../../utils/formatValue';

interface ProductProps {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

const Cart: React.FC = () => {
  const { increment, decrement, products } = useCart();

  function handleIncrement(id: string): void {
    increment(id);
  }

  function handleDecrement(id: string): void {
    decrement(id);
  }

  const cartTotal = useMemo(() => {
    const priceTotal = products.reduce<number>(
      (previosValue: number, currentValue: ProductProps): number => {
        return previosValue + currentValue.price * currentValue.quantity;
      },
      0,
    );

    return formatValue(priceTotal);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    const countItems = products.reduce<number>(
      (previosValue: number, currentValue: ProductProps): number => {
        return previosValue + currentValue.quantity;
      },
      0,
    );

    return countItems;
  }, [products]);

  const renderItem: ListRenderItem<ProductProps> = ({ item }) => (
    <Product>
      <ProductImage source={{ uri: item.image_url }} />
      <ProductTitleContainer>
        <ProductTitle>{item.title}</ProductTitle>
        <ProductPriceContainer>
          <ProductSinglePrice>{formatValue(item.price)}</ProductSinglePrice>

          <TotalContainer>
            <ProductQuantity>{`${item.quantity}x`}</ProductQuantity>

            <ProductPrice>
              {formatValue(item.price * item.quantity)}
            </ProductPrice>
          </TotalContainer>
        </ProductPriceContainer>
      </ProductTitleContainer>
      <ActionContainer>
        <ActionButton
          testID={`increment-${item.id}`}
          onPress={() => handleIncrement(item.id)}
        >
          <FeatherIcon name="plus" color="#E83F5B" size={16} />
        </ActionButton>
        <ActionButton
          testID={`decrement-${item.id}`}
          onPress={() => handleDecrement(item.id)}
        >
          <FeatherIcon name="minus" color="#E83F5B" size={16} />
        </ActionButton>
      </ActionContainer>
    </Product>
  );

  return (
    <Container>
      <ProductContainer>
        <ProductList
          data={products}
          keyExtractor={item => (item as ProductProps).id}
          ListFooterComponent={<View />}
          ListFooterComponentStyle={{
            height: 80,
          }}
          renderItem={renderItem as any}
        />
      </ProductContainer>
      <TotalProductsContainer>
        <FeatherIcon name="shopping-cart" color="#fff" size={24} />
        <TotalProductsText>{`${totalItensInCart} itens`}</TotalProductsText>
        <SubtotalValue>{cartTotal}</SubtotalValue>
      </TotalProductsContainer>
    </Container>
  );
};

export default Cart;
