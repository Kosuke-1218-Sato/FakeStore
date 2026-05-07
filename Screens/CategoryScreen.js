export default function CategoryScreen() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <View style={styles.container}>
      {categories.map((item, index) => (
        <Text key={index}>{item}</Text>
      ))}
    </View>
  );
}