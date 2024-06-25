import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

import { useGetProduct } from "../controller/useProduct/useGetProduct";
import { UProduct } from "../model/api/products";

interface ProductViewProps {
  isLoggedIn: boolean;
  setUpdateProduct: (value: React.SetStateAction<UProduct>) => void;
  onOpenUpdate: () => void;
  handleOpenAlert: (severity: string, message: string) => void;
}
export default function ProductView(props: ProductViewProps) {
  const { products, productCol, onProductClicked } = useGetProduct(
    props.isLoggedIn,
    props.setUpdateProduct,
    props.onOpenUpdate,
    props.handleOpenAlert
  );

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        alignSelf: "center",
      }}
    >
      <DataGrid
        onRowClick={onProductClicked}
        rows={products}
        columns={productCol}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
      />
    </Box>
  );
}
