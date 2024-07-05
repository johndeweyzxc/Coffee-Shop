import { DataGrid } from "@mui/x-data-grid";
import { useOrder } from "../controller/useOrder/useOrder";
import { Box } from "@mui/material";
import OrderDialog from "../components/Admin/OrderDialog";

interface OrderViewProps {
  isLoggedIn: boolean;
  handleOpenAlert: (severity: string, message: string) => void;
}
export default function OrderView(props: OrderViewProps) {
  const {
    isOpenOrderDialog,
    onCloseOrderDialog,

    orders,
    orderCol,
    onOrderClicked,
    onDeleteOrder,

    currentOrder,
    currAddOns,

    onChangeStatus,
    currStatus,
    onUpdateStatus,
    isStatusValid,
  } = useOrder(props.isLoggedIn, props.handleOpenAlert);

  return (
    <>
      <Box
        sx={{
          height: 500,
          width: "100%",
          alignSelf: "center",
        }}
      >
        <DataGrid
          onRowClick={onOrderClicked}
          rows={orders}
          columns={orderCol}
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
      <OrderDialog
        currAddOns={currAddOns}
        isOpen={isOpenOrderDialog}
        onClose={onCloseOrderDialog}
        selectedOrder={currentOrder}
        onDeleteOrder={onDeleteOrder}
        onChangeStatus={onChangeStatus}
        currentStatus={currStatus}
        onUpdateStatus={onUpdateStatus}
        isStatusValid={isStatusValid}
      />
    </>
  );
}
