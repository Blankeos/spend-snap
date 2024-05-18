import {
  ColumnDef,
  createSolidTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/solid-table";
import { For, mergeProps, Show } from "solid-js";
import Button from "./Button";
import { IconEmojiSad, IconLoading } from "./icons";

type TableProps<TData> = {
  columns: ColumnDef<TData>[];
  currentPage?: number;
  data: TData[];
  isLoading?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
};

export default function Table<TData>(props: TableProps<TData>) {
  const defaultProps = mergeProps(
    {
      currentPage: 0,
      isLoading: false,
      onNext: () => {},
      onPrev: () => {},
      hasNext: true, // Default must be page 1
      hasPrevious: false, // Default must be page 1
    },
    props
  );

  const table = createSolidTable({
    get data() {
      return props.data;
    },
    columns: props.columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div class="overflow-x-auto flex flex-col">
      <div class="min-h-40 flex flex-col">
        <table class="table">
          {/* head */}
          <thead>
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <tr>
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <th>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </thead>
          <tbody>
            <For each={defaultProps.isLoading ? [] : table.getRowModel().rows}>
              {(row) => (
                <tr>
                  <For each={row.getVisibleCells()}>
                    {(cell) => (
                      <td>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </tbody>
          <tfoot>
            <For each={table.getFooterGroups()}>
              {(footerGroup) => (
                <tr>
                  <For each={footerGroup.headers}>
                    {(header) => (
                      <th>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.footer,
                              header.getContext()
                            )}
                      </th>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </tfoot>
        </table>

        <Show when={props.isLoading}>
          <div class="text-gray-500 flex flex-col justify-center gap-y-2 items-center w-full flex-grow">
            <IconLoading font-size="1.5rem" />
            <span>Loading...</span>
          </div>
        </Show>

        <Show when={!props?.data?.length && !props.isLoading}>
          <div class="flex flex-col gap-y-2 items-center  w-full h-full flex-grow">
            <IconEmojiSad />
            <span>No data</span>
          </div>
        </Show>
      </div>

      <footer class="flex gap-x-2 items-center">
        <Button
          type="button"
          class="btn-ghost btn-xs"
          onClick={defaultProps.onPrev}
          disabled={!defaultProps.hasPrevious}
        >
          {"<"} Previous
        </Button>

        <span class="text-sm">{defaultProps.currentPage + 1}</span>

        <Button
          type="button"
          class="btn-ghost btn-xs"
          onClick={defaultProps.onNext}
          disabled={!defaultProps.hasNext}
        >
          Next {">"}
        </Button>
      </footer>
    </div>
  );
}
