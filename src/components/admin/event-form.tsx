import { Button, Input } from "@/components/ui";

import type { EventFormProps } from "./admin-dashboard.types";

export function EventForm({
  form,
  imageLabel = "대표 이미지",
  imageRequired = false,
  isLoading,
  onChange,
  onSubmit,
  submitLabel,
}: EventFormProps) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-800">
          {imageLabel}
        </span>
        <input
          accept="image/*"
          className="block w-full text-sm text-slate-600 file:mr-4 file:h-10 file:rounded-lg file:border-0 file:bg-sky-50 file:px-4 file:text-sm file:font-semibold file:text-sky-700"
          onChange={(event) =>
            onChange({
              ...form,
              image: event.target.files?.[0] ?? null,
            })
          }
          required={imageRequired}
          type="file"
        />
      </label>
      <Input
        label="이벤트명"
        name="eventName"
        onChange={(event) =>
          onChange({
            ...form,
            eventName: event.target.value,
          })
        }
        required
        value={form.eventName}
      />
      <Input
        label="상품명"
        name="productName"
        onChange={(event) =>
          onChange({
            ...form,
            productName: event.target.value,
          })
        }
        required
        value={form.productName}
      />
      <Input
        label="당첨 인원"
        min={1}
        name="winnerLimit"
        onChange={(event) =>
          onChange({
            ...form,
            winnerLimit: Number(event.target.value),
          })
        }
        required
        type="number"
        value={form.winnerLimit}
      />
      <Input
        label="시작 일시"
        name="startAt"
        onChange={(event) =>
          onChange({
            ...form,
            startAt: event.target.value,
          })
        }
        required
        type="datetime-local"
        value={form.startAt}
      />
      <Input
        label="종료 일시"
        name="endAt"
        onChange={(event) =>
          onChange({
            ...form,
            endAt: event.target.value,
          })
        }
        required
        type="datetime-local"
        value={form.endAt}
      />
      <Button className="w-full" isLoading={isLoading} type="submit">
        {submitLabel}
      </Button>
    </form>
  );
}
